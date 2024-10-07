// base libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { MathUtils, clamp } from 'three/src/math/MathUtils.js';

// third
// ...

// from project
import { AppEnvironmentHandler, environment } from '../../../../environments/environment';
import { EnviromentData } from '../../../../environments/environment';
import { AppVersionPanelComponent } from "../../../_jovdk-web/features/app-version-panel/app-version-panel.component";

@Component({
    selector: 'app-base-scene',
    standalone: true,
    imports: [],
    templateUrl: './base-scene.component.html',
    styleUrl: './base-scene.component.css'
})

export class BaseSceneComponent
{
    // dependencies
    _environmentData: EnviromentData = environment;
    // _cdnService: CdnService;:
    // _environmentHandler: MapEnvironmentHandler;
    _clock: THREE.Clock;
    // _fullAppComponent: FullAppComponent | undefined = undefined;

    // state
    _mixers: THREE.AnimationMixer[] = [];

    // parts
    // parts
    @ViewChild('canvasRootElement') _canvasRootElement: ElementRef | null = null;
    @ViewChild('canvasElement') _canvasElement: ElementRef | null = null;
    MainScene: THREE.Scene = new THREE.Scene();
    MainCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    _cameraRotationPivot: THREE.Object3D = new THREE.Object3D();
    MainRenderer: THREE.WebGLRenderer | null = null;
    OrbitControl: OrbitControls | null = null;

    _cube: THREE.Mesh | null = null;

    constructor()
    {
        // dependencies
        // this._cdnService = cdnService;
        // this._environmentHandler = new MapEnvironmentHandler(this);
        this._clock = new THREE.Clock();
    }

    ngOnInit(): void
    {
    }

    ngAfterViewInit(): void
    {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.createThreeJsBox();
    }

    createThreeJsBox()
    {
        this.MainScene = new THREE.Scene();
        this.MainCamera = new THREE.PerspectiveCamera(
            this._defaultCameraFrustumSize,
            1,
            0.1,
            1000);

        let canvasReference = this._canvasElement!.nativeElement as HTMLElement;

        this.MainRenderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference,
        });

        this.InstantiateBaseScene();
    }

    GetCanvasRootElement = (): HTMLElement =>
    {
        let element = this._canvasRootElement!.nativeElement as HTMLElement;
        return element;
    }

    GetCanvasRootRect = (): DOMRect =>
    {
        let element = this.GetCanvasRootElement();

        if (element == undefined)
            console.log("element IS NULL");

        if (element.getBoundingClientRect == undefined)
            console.log("element.getBoundingClientRect IS NULL");

        let value = element.getBoundingClientRect();

        return value;
    }

    GetCanvasElement = (): HTMLElement =>
    {
        let element = this._canvasElement!.nativeElement as HTMLElement;
        return element;
    }

    GetCanvasRect = (): DOMRect =>
    {
        let element = this.GetCanvasElement();

        if (element == undefined)
            console.log("element IS NULL");

        if (element.getBoundingClientRect == undefined)
            console.log("element.getBoundingClientRect IS NULL");

        let value = element.getBoundingClientRect();

        return value;
    }

    InstantiateBaseScene()
    {
        // scene
        this.MainScene.background = new THREE.Color("rgb(174, 217, 235)");

        // renderer
        // this.MainRenderer!.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(this.MainRenderer!.domElement);

        // camera
        let cameraDistance = 25 * (50 / 30);

        let cameraStartPosition = new THREE.Vector3(
            14.456699170384558,
            6.373384663289059,
            23.177927367017947)

        cameraStartPosition = cameraStartPosition.normalize();


        // this.MainScene.background = new THREE.MeshStandardMaterial({ color: 0x855a3c });
        // this.MainCamera.position.x = cameraStartPosition.x * cameraDistance;
        // this.MainCamera.position.y = cameraStartPosition.y * cameraDistance;
        // this.MainCamera.position.z = cameraStartPosition.z * cameraDistance;
        this.MainCamera.position.z = cameraDistance;

        // {
        //     "x": 3.647647679065124,
        //     "y": 1.5267865257712367,
        //     "z": -3.9859505901000816
        // }

        // camera
        // this.MainCamera.lookAt(new THREE.Vector3(0, 0, 0));

        // let mapName = environment.APP_NAME_TERM_01;
        let mapName = 'Fazendinha';

        // mapName = 'Zoo Mania';

        let cameraStartRotationByApp: { [key: string]: THREE.Euler } =
        {
            'Fazendinha': new THREE.Euler(-0.23, 0.55, 0),
            'Zoo Mania': new THREE.Euler(-0.40, -0.25, 0),
        }

        let startCameraRotation = cameraStartRotationByApp[mapName];

        this._cameraRotationPivot = new THREE.Object3D();
        this._cameraRotationPivot.position.set(0, 0, 0);
        let cameraStartRotation = this.MainCamera.rotation.clone();
        // this._cameraRotationPivot.rotation.set(0, cameraStartRotation.y - (Math.PI * (0 / 180.0)), 0);
        this._cameraRotationPivot.rotation.set(startCameraRotation.x, startCameraRotation.y, startCameraRotation.z);
        // this._cameraRotationPivot.rotation.y -= Math.PI;
        // this._cameraRotationPivot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), - Math.PI * 0.5);
        this._cameraRotationPivot.add(this.MainCamera);

        this._cameraGoalRotation = this._cameraRotationPivot.rotation.clone();

        this.MainScene.add(this._cameraRotationPivot);


        // this.InstantiateLights();



        // this.MainCamera.near = 0.001;
        // this.MainCamera.far = 500.0;
        // this.MainCamera.near = 0.5;
        // this.MainCamera.far = 500.0;
        // this.MainCamera.left = 100;
        // this.MainCamera.right = -100;
        // this.MainCamera.top = 100;
        // this.MainCamera.bottom = -100;



        // this.MainRenderer!.shadowMap = new THREE.WebGLShadowMap();
        // this.MainRenderer!.physicallyCorrectLights = true;
        // this.MainRenderer!.gammaOutput = true;
        this.MainRenderer!.outputColorSpace = THREE.SRGBColorSpace;

        // outputColorSpace .outputColorSpace


        // this.MainScene.env

        const loader = new THREE.CubeTextureLoader();

        loader.setPath('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/cube/Bridge2/');

        let textureCube = loader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);

        const textureLoader = new THREE.TextureLoader();
        // let textureEquirec = textureLoader.load('textures/2294472375_24a3b8ef46_o.jpg');
        // textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        // textureEquirec.colorSpace = THREE.SRGBColorSpace;

        // this.MainScene.background = textureCube;



        // ### debugging helpers ###
        AppEnvironmentHandler.DoIfLocal(
            () =>
            {
                // // light
                // const directionalLighthelper = new THREE.DirectionalLightHelper(light, 5);
                // this.MainScene.add(directionalLighthelper);
                // grid
                const gridHelper = new THREE.GridHelper(20, 20);
                this.MainScene.add(gridHelper);
                const axesHelper = new THREE.AxesHelper(40);
                this.MainScene.add(axesHelper);

                // camera
                // const arrowHelper = new THREE.ArrowHelper(this._cameraRotationPivot.rotation, new THREE.Vector3(0, 10, 0));
                // this.MainScene.add(arrowHelper);
            });

        // orbit controll
        this.OrbitControl = new OrbitControls(this.MainCamera, this.MainRenderer!.domElement);
        this.OrbitControl.enableRotate = false;
        this.OrbitControl.enableDamping = false;
        this.OrbitControl.enablePan = false;
        this.OrbitControl.minDistance = this._minCameraDistance;
        this.OrbitControl.maxDistance = 70;

        const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3);

        this.Update();

        this.SubscribeAllListeners();
        this.UpdateCameraFit();
    }

    Update = () =>
    {
        requestAnimationFrame(this.Update);

        if (this.OrbitControl != null)
            this.OrbitControl.update();

        let deltaTime = this._clock.getDelta();

        this._mixers.map((mixer) => mixer.update(deltaTime));

        this.HandleCameraPosition(deltaTime);
        this.HandleCameraRotation(deltaTime);

        this.MainRenderer!.render(this.MainScene, this.MainCamera);
    }

    OnCanvasResize()
    {
        this.UpdateCameraFit();
    }






    // state
    // _isCameraIdle: boolean = true;
    _isCameraIdle: boolean = false;
    _idleCameraInfluenceForce: number = 1;
    _idleCooldownTime: number = 0;
    // _maxCooldownTime: number = 5;
    _maxCooldownTime: number = 10;
    _cameraGoalRotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    // configs
    _idleCameraXRotationDelta: number = 0;
    _idleCameraYRotationDelta: number = 0;
    _idleCameraYRotationVelocityFactor: number = 0.2;
    // _idleCameraYRotationVelocityFactor: number = 5;
    _idleCameraXRotationDeltaFactor: number = Math.PI * (5 / 180.0);
    _idleCameraYRotationDeltaFactor: number = Math.PI * (24 / 180.0);


    _minCameraDistance: number = 20;
    _defaultCameraDistance: number = 41.0;
    _minZoomCameraPivotPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    _maxZoomCameraPivotPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 5);

    _defaultCameraFrustumSize: number = 30;









    UpdateCameraFit()
    {
        console.log("999");

        let canvasElement = this.GetCanvasRect();
        // let canvasRootElement = this.GetCanvasRootElement();
        let containerRect: DOMRect = this.GetCanvasRootRect();
        let aspect = canvasElement.width / canvasElement.height;

        if (aspect > 1)
        {
            // widescreen
            this.MainCamera.fov = this._defaultCameraFrustumSize * 1;
            // this.MainCamera.right = this._defaultCameraFrustumSize / aspect / 2;
            // this.MainCamera.left = this._defaultCameraFrustumSize / aspect / - 2;
            // this.MainCamera.top = this._defaultCameraFrustumSize / 2;
            // this.MainCamera.bottom = this._defaultCameraFrustumSize / - 2;
        }
        else
        {
            // portrait
            this.MainCamera.fov = this._defaultCameraFrustumSize / aspect;
            // this.MainCamera.right = this._defaultCameraFrustumSize / 2;
            // this.MainCamera.left = this._defaultCameraFrustumSize / - 2;
            // this.MainCamera.top = this._defaultCameraFrustumSize * aspect / 2;
            // this.MainCamera.bottom = this._defaultCameraFrustumSize * aspect / - 2;
        }

        // this.MainRenderer!.setSize(canvasRootElement.width, canvasRootElement.height);

        // this.MainCamera.sca
        // this.MainCamera.aspect = window.innerWidth / window.innerHeight;
        this.MainCamera.aspect = containerRect.width / containerRect.height;
        // this.MainRenderer!.setSize(window.innerWidth, window.innerHeight);
        this.MainRenderer!.setSize(containerRect.width, containerRect.height);
        this.MainCamera.updateProjectionMatrix();

        // console.log("## MainCamera.position = ");
        // console.log(this.MainCamera.position);
        // console.log("MainCamera.rotation = ");
        // console.log(this.MainCamera.rotation);
        // console.log("aspect = " + aspect);
    }

    OnContainerResize = () =>
    {
        let containerElement: HTMLElement = this.MainRenderer!.domElement.parentElement!;
        let containerRect: DOMRect = containerElement.getBoundingClientRect();
        this.MainRenderer!.setSize(containerRect.width, containerRect.height);

        this.MainCamera.aspect = containerRect.width / containerRect.height
        this.MainCamera.updateProjectionMatrix()
        // optional animate/renderloop call put here for render-on-changes
    }

    SubscribeAllListeners()
    {
        window.addEventListener('resize', () => this.OnContainerResize(), false);

        // let dragControl = new DragControls([], this.MainCamera, this.MainRenderer!.domElement);
        // dragControl. = 2;
        // dragControl.addEventListener('drag', (event) => this.onClick(event));

        // this.GetCanvasRootElement().addEventListener('resize', () => this.OnCanvasResize(), false);
        // let container: HTMLElement = this.MainRenderer!.domElement.parentElement!;
        // new ResizeObserver(() => this.OnCanvasResize()).observe(this.GetCanvasRootElement());
        // new ResizeObserver(() => this.OnContainerResize()).observe(container);
        // container.addEventListener('resize', this.OnContainerResize);

        // document.addEventListener('click', (event) => this.onClick(event));
        // this.MainRenderer!.domElement.addEventListener('click', (event) => this.onClick(event));
        // window.addEventListener('keydown', onKeyDown);
        // window.addEventListener('keyup', onKeyUp);


        // game-canvas -> mouse events
        this.MainRenderer!.domElement.onmousedown = (event) => this.OnMouseDown(event);
        this.MainRenderer!.domElement.onmousemove = (event) => this.OnMouseMove(event);
        this.MainRenderer!.domElement.ondrag = (event) => this.OnMouseDrag(event);
        this.MainRenderer!.domElement.onmouseup = (event) => this.OnMouseUp(event);
        // game-canvas -> touch events
        this.MainRenderer!.domElement.ontouchstart = (event) => this.OnTouchStart(event);
        this.MainRenderer!.domElement.ontouchmove = (event) => this.OnTouchMove(event);
        this.MainRenderer!.domElement.ontouchend = (event) => this.OnTouchEnd(event);
        this.MainRenderer!.domElement.ontouchcancel = (event) => this.OnTouchCancel(event);

        // window -> mouse events
        window.onmousedown = (event) => this.OnMouseStartWindow(event);
        window.onmouseup = (event) => this.OnMouseUp(event);
        // window -> touch events
        window.ontouchstart = (event) => this.OnTouchStartWindow(event);
        window.ontouchend = (event) => this.OnTouchEnd(event);
        window.ontouchcancel = (event) => this.OnTouchCancel(event);

        // this.MainRenderer!.domElement.addEventListener("touchend", this.OnMouseMove, false);
        // this.MainRenderer!.domElement.addEventListener("touchcancel", this.OnMouseMove, false);
        // this.MainRenderer!.domElement.addEventListener("touchleave", this.OnMouseMove, false);
        // this.MainRenderer!.domElement.addEventListener("touchmove", this.OnMouseMove, false);


        // window.addEventListener('mouseup', (event) => this.OnMouseUp(event), false);
        // window.addEventListener('touchend', (event) => this.OnMouseUp(event), false);
        // window.addEventListener('touchcancel', (event) => this.OnMouseUp(event), false);
    }

    // #region Inputs
    _isHoldingGameClick: boolean = false;
    _mouseClickStartPosition: THREE.Vector2 = new THREE.Vector2();
    _mouseClickCurrentPosition: THREE.Vector2 = new THREE.Vector2();

    OnMouseDown(event: MouseEvent)
    {
        // console.log("#> OnMouseDown")
        this.OnCLickDown(event.screenX, event.screenY);
    }

    OnMouseMove(event: MouseEvent)
    {
        // console.log("#> OnMouseMove")
        this.OnClickMove(event.screenX, event.screenY);
    }

    OnMouseDrag(event: MouseEvent)
    {
        // console.log("#> OnMouseDrag")
        this.OnClickMove(event.screenX, event.screenY);
    }

    OnMouseUp(event: MouseEvent)
    {
        // console.log("#> OnMouseUp")
        this.OnClickUp(event.screenX, event.screenY);
    }

    OnTouchStart(event: TouchEvent)
    {
        // console.log("#> OnTouchStart")
        this.OnCLickDown(event.touches[0].screenX, event.touches[0].screenY);
    }

    OnTouchMove(event: TouchEvent)
    {
        // console.log("#> OnTouchMove")
        this.OnClickMove(event.touches[0].screenX, event.touches[0].screenY);
    }

    OnTouchEnd(event: TouchEvent)
    {
        // console.log("#> OnTouchEnd")

        let screenPositionX = this._mouseClickCurrentPosition.x;
        let screenPositionY = this._mouseClickCurrentPosition.y;

        if (event.touches.length > 0)
        {
            screenPositionX = event.touches[0].screenX;
            screenPositionY = event.touches[0].screenY;
        }

        this.OnClickUp(screenPositionX, screenPositionY);
    }

    OnTouchCancel(event: TouchEvent)
    {
        // console.log("#> OnTouchCancel")

        this.RegisterGameActivity();

        let screenPositionX = this._mouseClickCurrentPosition.x;
        let screenPositionY = this._mouseClickCurrentPosition.y;

        if (event.touches.length > 0)
        {
            screenPositionX = event.touches[0].screenX;
            screenPositionY = event.touches[0].screenY;
        }

        this.OnClickUp(screenPositionX, screenPositionY);
    }

    OnMouseStartWindow = (event: MouseEvent) =>
    {
        this.OnClickWindow(event.screenX, event.screenY);
    }

    OnTouchStartWindow = (event: TouchEvent) =>
    {
        let screenPositionX = this._mouseClickCurrentPosition.x;
        let screenPositionY = this._mouseClickCurrentPosition.y;

        if (event.touches.length > 0)
        {
            screenPositionX = event.touches[0].screenX;
            screenPositionY = event.touches[0].screenY;
        }

        this.OnClickWindow(screenPositionX, screenPositionY);
    }

    OnClickWindow = (screenPositionX: number, screenPositionY: number) =>
    {
        // this.TryToPlayMusicThemeOnFirstInteraction();
    }

    OnCLickDown(screenPositionX: number, screenPositionY: number)
    {
        // console.log("#> OnCLickDown")

        this.RegisterGameActivity();

        if (!this._isHoldingGameClick)
        {
            this._mouseClickStartPosition = new THREE.Vector2(screenPositionX, screenPositionY);
            this._mouseClickCurrentPosition = new THREE.Vector2(screenPositionX, screenPositionY);
        }

        this._isHoldingGameClick = true;
    }

    OnClickMove(screenPositionX: number, screenPositionY: number)
    {
        // console.log("#> OnClickMove")

        if (this._isHoldingGameClick)
            this.HandleDrag(screenPositionX, screenPositionY);

        this._mouseClickCurrentPosition = new THREE.Vector2(screenPositionX, screenPositionY);
    }

    OnClickUp(screenPositionX: number, screenPositionY: number)
    {
        // console.log("#> OnClickUp")

        // this.RegisterGameActivity();

        this._isHoldingGameClick = false;
        this._mouseClickCurrentPosition = new THREE.Vector2(screenPositionX, screenPositionY);
    }

    HandleDrag(screenPositionX: number, screenPositionY: number)
    {
        this.RegisterGameActivity();

        let clickDeltaPositionX = screenPositionX - this._mouseClickCurrentPosition.x;
        let clickDeltaPositionY = screenPositionY - this._mouseClickCurrentPosition.y;
        // let clickDeltaPositionY = this._mouseClickCurrentPosition.y;

        let sensibility = 0.005;

        // this._cameraGoalRotation.x -= clickDeltaPositionY * sensibility;
        this._cameraGoalRotation.y -= clickDeltaPositionX * sensibility;

        // this._cameraGoalRotation.x = Clamp(this._cameraGoalRotation.x, -1, 0.25);
        this._cameraGoalRotation.y = Clamp(this._cameraGoalRotation.y, -1.5, 1.5);

        // console.log("#> HandleDrag | screenPositionX = " + screenPositionX)
        // console.log("#> HandleDrag | screenPositionY = " + screenPositionY)
        // console.log("#> HandleDrag | this._mouseClickCurrentPosition.x = " + this._mouseClickCurrentPosition.x)
        // console.log("#> HandleDrag | this._mouseClickCurrentPosition.y = " + this._mouseClickCurrentPosition.y)
        // console.log("#> HandleDrag | clickDeltaPositionX = " + clickDeltaPositionX)
        // console.log("#> HandleDrag | clickDeltaPositionY = " + clickDeltaPositionY)
    }
    // #endregion Inputs

    // #region Controller
    RegisterGameActivity()
    {
        // console.log("#> RegisterGameActivity");
        if (this._isCameraIdle)
            this._cameraGoalRotation = this._cameraRotationPivot.rotation.clone();

        this._idleCooldownTime = this._maxCooldownTime;
        this._isCameraIdle = false;
        this._idleCameraInfluenceForce = 0;
    }

    HandleCameraPosition(deltaTime: number): void
    {
        if (this._cameraRotationPivot != null)
        {
            if (this.OrbitControl != null)
            {
                let finalCameraPivotPosition: THREE.Vector3 = new THREE.Vector3().copy(this._minZoomCameraPivotPosition);

                let cameraDistance = this.OrbitControl.getDistance();
                if (cameraDistance < this._defaultCameraDistance)
                {
                    let zoomFactor =
                        (cameraDistance - this._minCameraDistance) /
                        (this._defaultCameraDistance - this._minCameraDistance);

                    let maxCameraPositionDeltaZ = this._maxZoomCameraPivotPosition.z - this._minZoomCameraPivotPosition.z;

                    let finalZPosition = maxCameraPositionDeltaZ * (1 - zoomFactor);
                    finalZPosition = this._minZoomCameraPivotPosition.z + finalZPosition;

                    finalCameraPivotPosition.z = finalZPosition;
                }

                // console.log("finalCameraPivotPosition.z = " + finalCameraPivotPosition.z);

                this.MainCamera.lookAt(this._cameraRotationPivot.position);

                this._cameraRotationPivot.position.set(
                    finalCameraPivotPosition.x,
                    finalCameraPivotPosition.y,
                    finalCameraPivotPosition.z);
            }
        }
    }

    HandleCameraRotation(deltaTime: number): void
    {
        if (this._cameraRotationPivot != null)
        {
            if (this._isCameraIdle)
            {
                this._idleCameraInfluenceForce += deltaTime * 0.1;
                this._idleCameraInfluenceForce = clamp(this._idleCameraInfluenceForce, 0, 1);

                this._idleCameraXRotationDelta = Math.sin(this._clock.elapsedTime * this._idleCameraYRotationVelocityFactor);
                this._idleCameraYRotationDelta = Math.cos(this._clock.elapsedTime * this._idleCameraYRotationVelocityFactor);
                // console.log("this._cameraDeltaRotation = " + this._cameraDeltaRotation);

                let finalCameraRotation: THREE.Euler = this._cameraGoalRotation.clone();

                finalCameraRotation.x += this._idleCameraXRotationDelta * (this._idleCameraXRotationDeltaFactor * this._idleCameraInfluenceForce / 2.0);
                finalCameraRotation.y += this._idleCameraYRotationDelta * (this._idleCameraYRotationDeltaFactor * this._idleCameraInfluenceForce / 2.0);

                this._cameraRotationPivot.rotation.set(finalCameraRotation.x, finalCameraRotation.y, finalCameraRotation.z);

                // console.log("_cameraGoalRotation =");
                // console.log(this._cameraGoalRotation);
                // console.log("finalCameraRotation =");
                // console.log(finalCameraRotation);
                // console.log("MainCamera.rotation =");
                // console.log(this.MainCamera.rotation);
                // console.log("_cameraRotationPivot.rotation =");
                // console.log(this._cameraRotationPivot.rotation);
            } else
            {
                let finalCameraRotation: THREE.Euler = this._cameraGoalRotation.clone();
                this._cameraRotationPivot.rotation.set(finalCameraRotation.x, finalCameraRotation.y, finalCameraRotation.z);

                this._idleCooldownTime -= deltaTime;
                this._idleCooldownTime = clamp(this._idleCooldownTime, 0, this._maxCooldownTime);

                // if (this._idleCooldownTime <= 0)
                //     this._isCameraIdle = true;
            }
        }
    }
    // #endregion Controller
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {Number} val The initial value
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @returns {Number} A number in the range (min, max)
 */
const Clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)
