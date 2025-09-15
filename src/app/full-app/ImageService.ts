import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ImageService
{
    private _imagesLoading = new Subject<number>();
    private images: Map<HTMLElement, boolean> = new Map();
    private imagesLoading = 0;

    imagesLoading$ = this._imagesLoading.asObservable();

    imageLoading(img: HTMLElement)
    {
        // console.log("ImageService | imageLoading > img = ", img);
        if (!this.images.has(img) || this.images.get(img))
        {
            this.images.set(img, false);
            this.imagesLoading++;
            this._imagesLoading.next(this.imagesLoading);
        }
    }

    forceImageLoadingCount = () =>
    {
        this.imagesLoading++;
        this._imagesLoading.next(this.imagesLoading);
    }

    imageLoadedOrError(img: HTMLElement)
    {
        if (this.images.has(img) && !this.images.get(img))
        {
            this.images.set(img, true);
            this.imagesLoading--;
            this._imagesLoading.next(this.imagesLoading);
        }
    }

    forceImageLoadingUncount = () =>
    {
        this.imagesLoading--;
        this._imagesLoading.next(this.imagesLoading);
    }
}
