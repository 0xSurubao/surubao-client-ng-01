// base libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { MathUtils, clamp, lerp } from 'three/src/math/MathUtils.js';

// third
// ...

// from project
import { AppEnvironmentHandler, environment } from '../../../../environments/environment';
import { EnviromentData } from '../../../../environments/environment';
import { AppVersionPanelComponent } from "../../../_jovdk-web/features/app-version-panel/app-version-panel.component";
import CdnService from '../../../_jovdk-web/features/cdn-service/cdn-service';
// import CdnService from '../../../_jovdk-web/features/cdn-service/cdn-service';

@Component({
    selector: 'threejs-base-scene',
    standalone: true,
    imports: [],
    templateUrl: './threejs-base-scene.component.html',
    styleUrl: './threejs-base-scene.component.css'
})

export class ThreeJsBaseSceneComponent
{
    // dependencies
    _clock: THREE.Clock = new THREE.Clock();
    _environmentData: EnviromentData = environment;
    _cdnService: CdnService = new CdnService(this._environmentData.CDN_URL);
    _glbLoader: GLTFLoader = new GLTFLoader();
    _textureLoader = new THREE.TextureLoader();

    // state
    _mixers: THREE.AnimationMixer[] = [];
    OnLoadFinishCallback: (() => void) | null = null;
    _rotationYVelocity = 1;
    _rotationYVelocityDecreaseVelocity = 35;
    _minYVelocity = 1;
    _maxYVelocity = 20;
    _isDragging = false;
    _goalCoinYRotation = 0;
    // music
    _audioListener!: THREE.AudioListener;
    _coinSfxBuffer!: AudioBuffer;


    // parts
    @ViewChild('canvasRootElement') _canvasRootElement: ElementRef | null = null;
    @ViewChild('canvasElement') _canvasElement: ElementRef | null = null;
    MainScene!: THREE.Scene;
    MainCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    _cameraRotationPivot: THREE.Object3D = new THREE.Object3D();
    MainRenderer: THREE.WebGLRenderer | null = null;
    OrbitControl: OrbitControls | null = null;

    constructor()
    {
        this.OnLoadFinishCallback = () => this.OnLoadFinish();
        this.LoadSfx();
    }

    OnLoadFinish = () =>
    {
        this.InstantiateLights();
        this.LoadCoin();
    }

    InstantiateLights()
    {
        // const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        const mainUpLight = new THREE.DirectionalLight(0xffffff, 2);
        const secondaryUpLight = new THREE.DirectionalLight(0xffffff, 1);

        mainUpLight.position.set(20, 30, 10);
        mainUpLight.target.position.set(0, 0, 0);
        mainUpLight.castShadow = true;

        secondaryUpLight.position.set(-20, 30, -10);
        secondaryUpLight.target.position.set(0, 0, 0);
        secondaryUpLight.castShadow = true;

        const reverseLight1 = new THREE.DirectionalLight(0xffffff, 1);
        const reverseLight2 = new THREE.DirectionalLight(0xffffff, 1);

        reverseLight1.position.set(20, -30, -10);
        reverseLight1.target.position.set(0, 0, 0);
        reverseLight1.castShadow = false;
        reverseLight2.position.set(-20, -30, 10);
        reverseLight2.target.position.set(0, 0, 0);
        reverseLight2.castShadow = false;
        // mainUpLight.shadow.bias = -0.001;
        // mainUpLight.shadow.mapSize.width = 2048;
        // mainUpLight.shadow.mapSize.height = 2048;
        // mainUpLight.shadow.radius = 5;
        // mainUpLight.shadow.normalBias = 10;

        const ambientLight = new THREE.AmbientLight(0xaaaaaa); // soft white light

        this.MainScene.add(ambientLight);
        this.MainScene.add(mainUpLight);
        // this._baseScene.MainScene.add(secondaryUpLight);
        // this._baseScene.MainScene.add(reverseLight1);
        // this._baseScene.MainScene.add(reverseLight2);

        AppEnvironmentHandler.DoIfLocal(
            () =>
            {
                // light
                const mainUpLightHelper = new THREE.DirectionalLightHelper(mainUpLight, 5);
                this.MainScene.add(mainUpLightHelper);
                const secondaryUpLightHelper = new THREE.DirectionalLightHelper(secondaryUpLight, 5);
                this.MainScene.add(secondaryUpLightHelper);
                const reverseLight1Helper = new THREE.DirectionalLightHelper(reverseLight1, 5);
                this.MainScene.add(reverseLight1Helper);
                const reverseLight2Helper = new THREE.DirectionalLightHelper(reverseLight2, 5);
                this.MainScene.add(reverseLight2Helper);
                // // grid
                // const gridHelper = new THREE.GridHelper(10, 10);
                // this._baseScene.MainScene.add(gridHelper);
                // // orbit controll
                // this.OrbitControl = new OrbitControls(this.MainCamera, this.MainRenderer.domElement);
            })
    }

    _coinModel!: THREE.Group<THREE.Object3DEventMap>;

    LoadCoin = async () =>
    {
        // let assetPath = this._cdnService.GetContentUrl(assetDefinition.CdnPath);
        let assetPath = this._cdnService.GetContentUrl('public/_app/features/home/BASE-ANGULAR-PROJECT-01.glb');
        console.log('assetPath = ', assetPath);

        let albedoTexturePath = this._cdnService.GetContentUrl('public/_app/features/home/BASE-ANGULAR-PROJECT-01-texture-01-albedo-22.jpg');
        let normalTexturePath = this._cdnService.GetContentUrl('public/_app/features/home/BASE-ANGULAR-PROJECT-01-texture-01-normal-21.png');

        let albedoTexture =
            await new Promise<THREE.Texture>(
                (resolve, reject) =>
                {
                    this._textureLoader.load(
                        albedoTexturePath,
                        (data: THREE.Texture) =>
                        {
                            data.flipY = false;
                            resolve(data);
                        },
                        undefined,
                        (err: unknown) =>
                        {
                            console.error(
                                'Error trying to load texture!', '\n',
                                'albedoTexturePath = ', albedoTexturePath, '\n',
                                'err = ', err, '\n',
                            );
                            reject(err);
                        }
                    )
                })
                .catch(
                    (reason: any) =>
                    {
                        console.error(
                            'Error trying to load texture!', '\n',
                            'albedoTexturePath = ', albedoTexturePath, '\n',
                            'reason = ', reason, '\n',
                        );
                    }
                );

        let normalTexture =
            await new Promise<THREE.Texture>(
                (resolve, reject) =>
                {
                    this._textureLoader.load(
                        normalTexturePath,
                        (data: THREE.Texture) =>
                        {
                            data.flipY = false;
                            resolve(data);
                        },
                        undefined,
                        (err: unknown) =>
                        {
                            console.error(
                                'Error trying to load texture!', '\n',
                                'normalTexturePath = ', normalTexturePath, '\n',
                                'err = ', err, '\n',
                            );
                            reject(err);
                        }
                    )
                })
                .catch(
                    (reason: any) =>
                    {
                        console.error(
                            'Error trying to load texture!', '\n',
                            'normalTexturePath = ', normalTexturePath, '\n',
                            'reason = ', reason, '\n',
                        );
                    }
                );

        await this._glbLoader.loadAsync(assetPath)
            .then(
                (modelGLTF: GLTF) =>
                {
                    this._coinModel = modelGLTF.scene.clone();

                    this._coinModel.position.setY(1);

                    this._coinModel.traverse(
                        (obj: THREE.Object3D<THREE.Object3DEventMap>) =>
                        {
                            let objectMesh = obj as THREE.Mesh;

                            if (objectMesh.isMesh)
                            {
                                console.log('objectMesh = ', objectMesh.name);

                                let material = new THREE.MeshStandardMaterial();

                                if (albedoTexture)
                                    material.map = albedoTexture;

                                if (normalTexture)
                                    material.normalMap = normalTexture;

                                objectMesh.material = material;
                            }
                        });

                    this.MainScene.add(this._coinModel);
                    // finalModelGLTF = modelGLTF;

                    // cacheObject = modelGLTF;
                    // loadingSucces = true;
                })
            .catch(
                (reason: any) =>
                {
                    console.error(
                        'Error trying to load model!', '\n',
                        'assetPath = ', assetPath, '\n',
                        'reason = ', reason, '\n',
                    );
                }
            );
    }

    ngAfterViewInit(): void
    {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.createThreeJsBox();
    }

    ngOnDestroy(): void
    {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this._mixers = [];
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
        // this.MainScene.background = new THREE.Color("rgb(174, 217, 235)");
        // this.MainScene.background = new THREE.Color("rgb(22, 20, 25)");
        // this.MainScene.background = new THREE.Color("rgb(3, 7, 18)");
        // this.MainScene.background = new THREE.Color("rgb(2, 5, 15)");
        this.MainScene.background = new THREE.Color("rgb(0, 0, 0)");

        // renderer
        // this.MainRenderer!.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(this.MainRenderer!.domElement);

        // camera
        // let cameraDistance = 25 * (50 / 30);
        let cameraDistance = this._defaultCameraDistance;

        // let cameraStartPosition = new THREE.Vector3(
        //     14.456699170384558,
        //     6.373384663289059,
        //     23.177927367017947)
        // let cameraStartPosition = new THREE.Vector3(
        //     14.456699170384558,
        //     6.373384663289059,
        //     23.177927367017947)

        // cameraStartPosition = cameraStartPosition.normalize();


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
        // let mapName = 'Fazendinha';

        // mapName = 'Zoo Mania';

        // let cameraStartRotationByApp: { [key: string]: THREE.Euler } =
        // {
        //     'Fazendinha': new THREE.Euler(-0.23, 0.55, 0),
        //     'Zoo Mania': new THREE.Euler(-0.40, -0.25, 0),
        // }

        // let startCameraRotation = cameraStartRotationByApp[mapName];


        // let startCameraRotation = new THREE.Euler(-0.40, -0.25, 0);
        // let startCameraRotation = new THREE.Euler(-0.23, 0.55, 0);
        let startCameraRotation = new THREE.Euler(-0, 0.1, 0);

        this._cameraRotationPivot = new THREE.Object3D();
        let finalPivotYPosition = this._defaultCameraPivotPosition.y + this._masterVerticalPositionDelta;
        this._cameraRotationPivot.position.set(0, finalPivotYPosition, 0);
        // let cameraStartRotation = this.MainCamera.rotation.clone();
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
        this.OrbitControl.enableZoom = false;
        this.OrbitControl.minDistance = this._minCameraDistance;
        this.OrbitControl.maxDistance = this._maxCameraDistance;

        const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3);

        this.Update();

        this.SubscribeAllListeners();
        this.UpdateCameraFit();

        if (this.OnLoadFinishCallback)
            this.OnLoadFinishCallback();
    }

    OnUpdateCallback: (() => void) | undefined = undefined;



    Update = () =>
    {
        requestAnimationFrame(this.Update);

        if (this.OnUpdateCallback)
            this.OnUpdateCallback();

        if (this.OrbitControl != null)
            this.OrbitControl.update();

        let deltaTime = this._clock.getDelta();

        if (this._coinModel && !this._isDragging)
        {
            this._rotationYVelocity -= deltaTime * this._rotationYVelocityDecreaseVelocity;

            if (this._rotationYVelocity <= this._minYVelocity)
                this._rotationYVelocity = this._minYVelocity

            let finalRotationY = this._coinModel.rotation.y;

            finalRotationY += (deltaTime * this._rotationYVelocity);

            this._coinModel.rotation.set(
                this._coinModel.rotation.x,
                finalRotationY,
                this._coinModel.rotation.z,
            )
        }

        this._mixers.map((mixer) => mixer.update(deltaTime));

        this.HandleCameraZoom(deltaTime);
        this.HandleCameraPosition(deltaTime);
        this.HandleCameraRotation(deltaTime);

        this.MainRenderer!.render(this.MainScene, this.MainCamera);

        // console.log('_mixers.length = ', this._mixers.length);
    }

    OnCanvasResize()
    {
        this.UpdateCameraFit();
    }



    // camera state
    _cameraPivotGoalPosition: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    _defaultCameraPivotPosition: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    _cameraGoalZoom: number = 4;
    _cameraVerticalPositionDeltaFactor: number = 0;
    _maxMasterVerticalPositionDelta: number = 2.2;
    // _masterVerticalPositionDelta: number = this._maxMasterVerticalPositionDelta;
    _masterVerticalPositionDelta: number = this._cameraVerticalPositionDeltaFactor;

    // configs
    _minCameraVesticalPositionDelta = -0.8;
    _maxCameraVesticalPositionDelta = 0.8;



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


    _minCameraDistance: number = 2;
    _maxCameraDistance: number = 4;
    _defaultCameraDistance: number = 4;

    _minZoomCameraPivotPosition: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    _maxZoomCameraPivotPosition: THREE.Vector3 = new THREE.Vector3(0, 1, 5);

    _defaultCameraFrustumSize: number = 30;









    UpdateCameraFit()
    {
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
        this.MainRenderer!.domElement.onmouseup = (event) => this.OnMouseUpGame(event);
        // game-canvas -> touch events
        this.MainRenderer!.domElement.ontouchstart = (event) => this.OnTouchStart(event);
        this.MainRenderer!.domElement.ontouchmove = (event) => this.OnTouchMove(event);
        this.MainRenderer!.domElement.ontouchend = (event) => this.OnTouchEnd(event);
        this.MainRenderer!.domElement.ontouchcancel = (event) => this.OnTouchCancel(event);
        this.MainRenderer!.domElement.onwheel = this.OnWheel;

        // window -> mouse events
        window.onmousedown = (event) => this.OnMouseStartWindow(event);
        window.onmouseup = (event) => this.OnMouseUpWindow(event);
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

    OnWheel = (event: WheelEvent) =>
    {
        event.preventDefault();
        event.stopPropagation();

        let wheelZoomFactor = 0.003;
        this._cameraGoalZoom += (event.deltaY * wheelZoomFactor)
    }

    OnMouseDown(event: MouseEvent)
    {
        this._goalCoinYRotation = this._coinModel.rotation.y;
        this._isDragging = true;

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

    OnMouseUpGame = (event: MouseEvent) =>
    {
        this._rotationYVelocity = this._maxYVelocity;
        this.PlayCoinSfx();

        this.OnMouseUp(event);
    }

    OnMouseUpWindow = (event: MouseEvent) =>
    {
        this.OnMouseUp(event);
    }

    OnMouseUp(event: MouseEvent)
    {
        this._isDragging = false;

        // console.log("#> OnMouseUp")
        this.OnClickUp(event.screenX, event.screenY);
    }



    LoadSfx = () =>
    {
        let musicThemeUrl = environment.CDN_URL + '/public/_app/features/home/coin-sfx-01.mp3';
        const audioLoader = new THREE.AudioLoader();
        this._audioListener = new THREE.AudioListener();

        audioLoader.load(
            musicThemeUrl,
            (buffer) =>
            {
                this._coinSfxBuffer = buffer;
            },
            // onProgress callback
            undefined,
            // onError callback
            (error) =>
            {
                console.error('################ ERROR trying to TryToPlayMusicThemeOnFirstInteraction');
                console.error(error);
            });
    }

    PlayCoinSfx = () =>
    {
        if (this._coinSfxBuffer)
        {
            let coinSfxClip = new THREE.Audio(this._audioListener);

            coinSfxClip.setBuffer(this._coinSfxBuffer);
            coinSfxClip.setLoop(false);
            coinSfxClip.setVolume(0.15);

            coinSfxClip.play();
        }
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

        let sensibility = 0.005;

        // this._cameraGoalRotation.x -= clickDeltaPositionY * sensibility;
        // this._cameraGoalRotation.y += clickDeltaPositionX * sensibility;

        this._goalCoinYRotation += clickDeltaPositionX * sensibility;

        // this._cameraGoalRotation.x = Clamp(this._cameraGoalRotation.x, -1, 0.25);
        // this._cameraGoalRotation.y = Clamp(this._cameraGoalRotation.y, -3.1415, 3.1415);

        // this._cameraVerticalPositionDeltaFactor += clickDeltaPositionY * sensibility;
        // this._cameraVerticalPositionDeltaFactor = clamp(this._cameraVerticalPositionDeltaFactor, this._minCameraVesticalPositionDelta, this._maxCameraVesticalPositionDelta);

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

    HandleCameraZoom = (deltaTime: number) =>
    {
        this._cameraGoalZoom = clamp(this._cameraGoalZoom, this._minCameraDistance, this._maxCameraDistance);

        if (this.OrbitControl)
        {
            let cameraVelocity = 10;

            let zoomDelta = this._cameraGoalZoom - this._currentCameraDistance;
            zoomDelta = clamp(zoomDelta, -cameraVelocity * deltaTime, cameraVelocity * deltaTime);
            // let finalZoom = this._currentCameraDistance + zoomDelta;
            let finalZoom = lerp(this._currentCameraDistance, this._cameraGoalZoom, clamp(cameraVelocity * deltaTime, 0, 0.2));
            this._currentCameraDistance = finalZoom;
            this.MainCamera.position.setLength(this._currentCameraDistance);
        }
    }

    _currentCameraDistance = this._maxCameraDistance;

    HandleCameraPosition(deltaTime: number): void
    {
        if (this._cameraRotationPivot != null)
        {
            if (this.OrbitControl != null)
            {
                let finalCameraPivotPosition: THREE.Vector3 = new THREE.Vector3().copy(this._minZoomCameraPivotPosition);

                // let cameraDistance = this.OrbitControl._currentCameraDistance;
                // if (cameraDistance < this._defaultCameraDistance)
                // {
                //     let zoomFactor =
                //         (cameraDistance - this._minCameraDistance) /
                //         (this._defaultCameraDistance - this._minCameraDistance);

                //     let maxCameraPositionDeltaZ = this._maxZoomCameraPivotPosition.z - this._minZoomCameraPivotPosition.z;

                //     let finalZPosition = maxCameraPositionDeltaZ * (1 - zoomFactor);
                //     finalZPosition = this._minZoomCameraPivotPosition.z + finalZPosition;

                //     finalCameraPivotPosition.z = finalZPosition;
                // }

                // console.log("finalCameraPivotPosition.z = " + finalCameraPivotPosition.z);

                // let cameraVelocity = 6;
                let cameraVelocity = 10;
                // let cameraVelocity = 2.8;

                let maxZoomDelta = this._maxCameraDistance - this._minCameraDistance;
                let cameraZoomDeltaFactor = 1 - ((this._currentCameraDistance - this._minCameraDistance) / maxZoomDelta);
                let goalCameraYPosition = this._masterVerticalPositionDelta + this._defaultCameraPivotPosition.y + (this._cameraVerticalPositionDeltaFactor * cameraZoomDeltaFactor);
                // let verticalDelta = clamp(goalCameraYPosition - this._cameraRotationPivot.position.y, -cameraVelocity * deltaTime, cameraVelocity * deltaTime);
                // let finalPosition = this._cameraRotationPivot.position.y + verticalDelta;
                let finalYPosition = lerp(this._cameraRotationPivot.position.y, goalCameraYPosition, clamp(cameraVelocity * deltaTime, 0, 0.2));
                // finalYPosition = clamp(finalYPosition, 0, 10);

                this._cameraRotationPivot.position.set(
                    finalCameraPivotPosition.x,
                    finalYPosition,
                    finalCameraPivotPosition.z);

                this.MainCamera.lookAt(this._cameraRotationPivot.position);
            }
        }
    }

    HandleCameraRotation(deltaTime: number): void
    {
        // if (this._cameraRotationPivot != null)
        // {
        //     let cameraVelocity = 6;
        //     let finalCameraRotation: THREE.Euler = this._cameraGoalRotation.clone();

        //     this._cameraRotationPivot.rotation.set(
        //         lerp(this._cameraRotationPivot.rotation.x, finalCameraRotation.x, clamp(cameraVelocity * deltaTime, 0, 0.2)),
        //         lerp(this._cameraRotationPivot.rotation.y, finalCameraRotation.y, clamp(cameraVelocity * deltaTime, 0, 0.2)),
        //         lerp(this._cameraRotationPivot.rotation.z, finalCameraRotation.z, clamp(cameraVelocity * deltaTime, 0, 0.2)),
        //     );

        //     // this._idleCooldownTime -= deltaTime;
        //     // this._idleCooldownTime = clamp(this._idleCooldownTime, 0, this._maxCooldownTime);
        // }

        if (this._coinModel && this._isDragging)
        {
            let cameraVelocity = 6;
            // let finalCameraRotation: THREE.Euler = this._cameraGoalRotation.clone();
            let finalCoinRotation: THREE.Euler = this._coinModel.rotation.clone();

            this._coinModel.rotation.set(
                lerp(this._coinModel.rotation.x, finalCoinRotation.x, cameraVelocity * deltaTime),
                lerp(this._coinModel.rotation.y, this._goalCoinYRotation, cameraVelocity * deltaTime),
                lerp(this._coinModel.rotation.z, finalCoinRotation.z, cameraVelocity * deltaTime),
            );

            // this._idleCooldownTime -= deltaTime;
            // this._idleCooldownTime = clamp(this._idleCooldownTime, 0, this._maxCooldownTime);
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
