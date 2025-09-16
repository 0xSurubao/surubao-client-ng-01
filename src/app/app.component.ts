import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';
import { ImageService } from './full-app/ImageService';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgIf, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private readonly imageService = inject(ImageService);

    isLoadingContent = false;
    readonly spinnerUrl = `${environment.app.cdnUrl}/public/_app/features/generic-ui/sprites/loading-icon-01.png`;

    constructor() {
        this.imageService.imagesLoading$.subscribe((value) => {
            this.isLoadingContent = value > 0;
        });
    }
}
