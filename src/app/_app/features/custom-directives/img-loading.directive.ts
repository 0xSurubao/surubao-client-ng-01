import { isPlatformBrowser } from '@angular/common';
import
{
    AfterContentInit,
    Directive,
    ElementRef,
    HostListener,
    inject,
    Inject,
    Input,
    OnInit,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';

import { ImageService } from '../../../full-app/ImageService';


@Directive({
    selector: 'img',
    standalone: true
})
export class ImgLoadingDirective implements OnInit, AfterContentInit
{
    _imageService: ImageService = inject(ImageService);


    // @Input()
    // public src!: string;
    @Input()
    public loaderSrc: string = '/assets/image-loading.png';
    @Input()
    public errorSrc: string = '/assets/image-not-found.png';
    @Input()
    public lazyLoad: boolean = false;

    private alreadyTriedLoading: boolean = false;
    private alreadyTriedError: boolean = false;

    constructor(
        private el: ElementRef<HTMLImageElement>,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    )
    {
        // console.log('ImageLoaderDirective | constructor > el = ', el);
        this._imageService.imageLoading(el.nativeElement);
    }

    ngOnInit(): void
    {
        // this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
        // console.log('ImageLoaderDirective | ngOnInit >');

        if (this.lazyLoad)
        {
            this.renderer.setAttribute(this.el.nativeElement, 'loading', 'lazy');
        }
    }

    ngAfterContentInit(): void
    {
        // console.log('ImageLoaderDirective | ngAfterContentInit >');
        if (this.shouldDisplayLoader())
        {
            // this.renderer.setAttribute(this.el.nativeElement, 'src', this.loaderSrc);
        } else
        {
            // this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
        }
    }

    @HostListener('load')
    public onLoad(): void
    {
        // console.log("#>> load");

        if (!this.alreadyTriedLoading)
        {
            // this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
        }
        this.alreadyTriedLoading = true;

        this._imageService.imageLoadedOrError(this.el.nativeElement);
    }

    @HostListener('error')
    public onError(): void
    {
        // console.log("#>> error");

        if (!this.alreadyTriedError)
        {
            // this.renderer.setAttribute(this.el.nativeElement, 'src', this.errorSrc);
        }
        this.alreadyTriedError = true;

        this._imageService.imageLoadedOrError(this.el.nativeElement);
    }

    private shouldDisplayLoader(): boolean
    {
        return (
            isPlatformBrowser(this.platformId) && !this.el.nativeElement.complete
        );
    }
}

