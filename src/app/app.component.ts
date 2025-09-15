import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullAppComponent } from "./full-app/full-app.component";
import { ImageService } from './full-app/ImageService';
import { NgIf } from '@angular/common';
import { ImgLoadingDirective } from './_app/features/custom-directives/img-loading.directive';
import { ThreeJsBaseSceneComponent } from './_jovdk-web-threejs/features/base-scene/threejs-base-scene.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NgIf,
        // RouterOutlet,
        FullAppComponent,
        ImgLoadingDirective,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent
{
    // dependencies
    _imageService: ImageService = inject(ImageService);

    _isLoadingContent = true;

    // parts
    @ViewChild('_threeJsBaseScene') _fullApp!: FullAppComponent;

    constructor()
    {
        this._imageService.imagesLoading$.subscribe(
            (value) =>
            {
                // console.log('>>>>>> images.length = ' + value);

                if (value == 0)
                {
                    this._isLoadingContent = false;

                    // this._fullApp._threeJsBaseScene.UpdateCameraFit();
                }
            });
    }
}
