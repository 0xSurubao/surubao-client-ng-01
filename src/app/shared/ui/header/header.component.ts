import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    private readonly authService = inject(AuthService);

    readonly environmentName = environment.name;
    readonly publicKey$ = this.authService.publicKey$;

    truncateKey(key: string | null): string {
        if (!key) {
            return '—';
        }
        return `${key.slice(0, 5)}…${key.slice(-4)}`;
    }

    logout(): void {
        this.authService.logout();
    }
}
