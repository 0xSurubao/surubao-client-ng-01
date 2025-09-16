import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, from, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';

import { environment } from '../../../environments/environment';

interface Sep10ChallengeResponse {
    challengeXDR: string;
    networkPassphrase: string;
    expiresAt: number;
}

interface Sep10VerifyResponse {
    accessToken: string;
    expiresAt: number;
}

interface AuthMeResponse {
    sub: string;
    scopes: string[];
    tokenExp: number;
}

export interface AuthState {
    readonly accessToken: string;
    readonly expiresAt: number;
    readonly publicKey: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
    private readonly storageKey = 'surubao-auth-state';
    private readonly authStateSubject = new BehaviorSubject<AuthState | null>(null);
    private expiryTimer: ReturnType<typeof setTimeout> | null = null;

    readonly authState$ = this.authStateSubject.asObservable();
    readonly isLoggedIn$ = this.authState$.pipe(
        map((state) => !!state && !this.isExpired(state)),
        distinctUntilChanged(),
    );
    readonly publicKey$ = this.authState$.pipe(
        map((state) => state?.publicKey ?? null),
        distinctUntilChanged(),
    );

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) {
        this.restoreSession();
    }

    ngOnDestroy(): void {
        this.clearExpiryTimer();
    }

    login(): Observable<void> {
        return from(this.performLoginFlow());
    }

    logout(options: { redirect?: boolean; silent?: boolean } = {}): void {
        this.commitState(null);
        if (!options.silent && options.redirect !== false) {
            void this.router.navigate(['/login']);
        } else if (options.redirect) {
            void this.router.navigate(['/login']);
        }
    }

    handleUnauthorized(): void {
        if (this.authStateSubject.value) {
            this.logout({ silent: true, redirect: true });
        }
    }

    getAccessToken(): string | null {
        return this.authStateSubject.value?.accessToken ?? null;
    }

    getPublicKeySnapshot(): string | null {
        return this.authStateSubject.value?.publicKey ?? null;
    }

    private async performLoginFlow(): Promise<void> {
        if (!(await this.ensureFreighterAvailable())) {
            throw new Error('Freighter wallet is not available or is locked.');
        }

        const accessResponse = await requestAccess();
        if (!accessResponse || !('address' in accessResponse) || !accessResponse.address) {
            const message = (accessResponse as any)?.error?.message ?? 'Wallet access was rejected.';
            throw new Error(message);
        }
        const publicKey = accessResponse.address;

        const challenge = await firstValueFrom(
            this.http.get<Sep10ChallengeResponse>(`${environment.apiBaseUrl}/auth/sep10`, {
                params: new HttpParams().set('clientPublicKey', publicKey).set('account', publicKey),
            }),
        );

        const networkPassphrase = challenge.networkPassphrase || environment.stellar.networkPassphrase;
        const signatureResponse = await signTransaction(challenge.challengeXDR, {
            networkPassphrase,
            address: publicKey,
        });

        if (!signatureResponse || (signatureResponse as any).error) {
            const message = (signatureResponse as any)?.error?.message ?? 'Challenge transaction signing failed.';
            throw new Error(message);
        }

        const signedXDR = signatureResponse.signedTxXdr;
        if (!signedXDR) {
            throw new Error('Challenge transaction signing was cancelled.');
        }

        const verification = await firstValueFrom(
            this.http.post<Sep10VerifyResponse>(`${environment.apiBaseUrl}/auth/sep10/verify`, {
                signedXDR,
                clientPublicKey: publicKey,
            }),
        );

        const authState: AuthState = {
            accessToken: verification.accessToken,
            expiresAt: Number(verification.expiresAt),
            publicKey,
        };

        this.commitState(authState);
        await this.validateSession();
    }

    private async ensureFreighterAvailable(): Promise<boolean> {
        try {
            const response = await isConnected();
            if (response?.error) {
                console.error('Failed to detect Freighter extension.', response.error);
                return false;
            }
            return Boolean(response?.isConnected);
        } catch (error) {
            console.error('Failed to detect Freighter extension.', error);
            return false;
        }
    }

    private restoreSession(): void {
        if (!this.hasStorage()) {
            return;
        }

        const rawState = localStorage.getItem(this.storageKey);
        if (!rawState) {
            return;
        }

        try {
            const stored = JSON.parse(rawState) as AuthState;
            if (stored && stored.accessToken && !this.isExpired(stored)) {
                this.commitState(stored, { persist: false });
                void this.validateSession();
            } else {
                this.clearStoredState();
            }
        } catch (error) {
            console.warn('Failed to parse stored auth state.', error);
            this.clearStoredState();
        }
    }

    private async validateSession(): Promise<void> {
        const state = this.authStateSubject.value;
        if (!state) {
            return;
        }

        try {
            await firstValueFrom(this.http.get<AuthMeResponse>(`${environment.apiBaseUrl}/auth/me`));
        } catch (error) {
            console.warn('Auth session validation failed. Logging out.', error);
            this.logout({ silent: true, redirect: true });
        }
    }

    private commitState(state: AuthState | null, options: { persist?: boolean } = {}): void {
        const shouldPersist = options.persist !== false;
        this.clearExpiryTimer();

        if (state && this.isExpired(state)) {
            state = null;
        }

        this.authStateSubject.next(state);

        if (shouldPersist && this.hasStorage()) {
            if (state) {
                localStorage.setItem(this.storageKey, JSON.stringify(state));
            } else {
                this.clearStoredState();
            }
        } else if (!state) {
            this.clearStoredState();
        }

        if (state) {
            this.scheduleExpiry(state);
        }
    }

    private scheduleExpiry(state: AuthState): void {
        const expiresInMs = state.expiresAt * 1000 - Date.now();
        if (expiresInMs <= 0) {
            this.logout({ silent: true, redirect: true });
            return;
        }

        const timeout = Math.max(expiresInMs - 60_000, 5000);
        this.expiryTimer = setTimeout(() => {
            this.logout({ silent: true, redirect: true });
        }, timeout);
    }

    private clearExpiryTimer(): void {
        if (this.expiryTimer) {
            clearTimeout(this.expiryTimer);
            this.expiryTimer = null;
        }
    }

    private clearStoredState(): void {
        if (this.hasStorage()) {
            localStorage.removeItem(this.storageKey);
        }
    }

    private hasStorage(): boolean {
        return typeof window !== 'undefined' && !!window.localStorage;
    }

    private isExpired(state: AuthState): boolean {
        return state.expiresAt * 1000 <= Date.now();
    }
}


