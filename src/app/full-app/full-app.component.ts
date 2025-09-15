// base libs
// import { Component } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import 'flowbite';

// third
// ...

// from project
import { AppEnvironmentHandler, environment } from '../../environments/environment';
import { EnviromentData } from '../../environments/environment';
import { AppVersionPanelComponent } from "../_jovdk-web/features/app-version-panel/app-version-panel.component";
import { ThreeJsBaseSceneComponent } from './../_jovdk-web-threejs/features/base-scene/threejs-base-scene.component';
import { NgFor, NgIf } from '@angular/common';
import { NavBarComponent } from "../_app/features/home/nav-bar/nav-bar.component";


import { Component, VERSION, ViewChildren, QueryList, AfterViewInit, OnDestroy, ContentChildren, inject, ViewChild } from '@angular/core';
import { ImgLoadingDirective } from '../_app/features/custom-directives/img-loading.directive';
import { forkJoin, Subscription } from 'rxjs';
import { ImageService } from './ImageService';
import { LocalizationService } from '../_jovdk-web/features/localization-service/localization-service.service';

@Component({
    selector: 'full-app',
    standalone: true,
    imports: [
        // NgIf,
        // NgFor,
        AppVersionPanelComponent,
        // ThreeJsBaseSceneComponent,
        NavBarComponent,
        ImgLoadingDirective,
    ],
    templateUrl: './full-app.component.html',
    styleUrl: './full-app.component.css',
})
export class FullAppComponent
{
    // dependencies
    _environmentData: EnviromentData = environment;
    _localizationService: LocalizationService = inject(LocalizationService);
    _imageService: ImageService = inject(ImageService);

    // state
    _isLoadingContent = true;
    _isProd = AppEnvironmentHandler.IsProd();
    _isLocal = AppEnvironmentHandler.IsLocal();

    // parts
    @ViewChild('_threeJsBaseScene') _threeJsBaseScene!: ThreeJsBaseSceneComponent;

    constructor()
    {
        this._imageService.imagesLoading$.subscribe(
            (value) =>
            {
                // console.log('>>>>>> images.length = ' + value);

                if (value == 0)
                    this._isLoadingContent = false;
            });
    }

}
