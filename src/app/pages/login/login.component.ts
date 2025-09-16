import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    isConnecting = false;
    errorMessage: string | null = null;

    async connectWallet(): Promise<void> {
        if (this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        this.errorMessage = null;

        try {
            await firstValueFrom(this.authService.login());
            await this.router.navigateByUrl('/');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Wallet login failed. Please try again.';
            this.errorMessage = message;
        } finally {
            this.isConnecting = false;
        }
    }
}
