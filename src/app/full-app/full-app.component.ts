// base libs
import { Component } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

// third
// ...

// from project
import { AppEnvironmentHandler, environment } from '../../environments/environment';
import { EnviromentData } from '../../environments/environment';
import { AppVersionPanelComponent } from "../_jovdk-web/features/app-version-panel/app-version-panel.component";
import { BaseSceneComponent } from "../_jovdk-web-threejs/features/base-scene/base-scene.component";

@Component({
    selector: 'full-app',
    standalone: true,
    imports: [AppVersionPanelComponent, BaseSceneComponent],
    templateUrl: './full-app.component.html',
    styleUrl: './full-app.component.css'
})
export class FullAppComponent
{
}
