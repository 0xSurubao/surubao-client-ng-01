import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';
import { AuthService } from './core/auth/auth.service';
import { ImageService } from './full-app/ImageService';
import { HeaderComponent } from './shared/ui/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgIf, RouterOutlet, HeaderComponent, AsyncPipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private readonly imageService = inject(ImageService);
    private readonly authService = inject(AuthService);

    isLoadingContent = false;
    readonly isLoggedIn$ = this.authService.isLoggedIn$;
    readonly spinnerUrl = `${environment.app.cdnUrl}/public/_app/features/generic-ui/sprites/loading-icon-01.png`;

    constructor() {
        this.imageService.imagesLoading$.subscribe((value) => {
            this.isLoadingContent = value > 0;
        });
    }
}
