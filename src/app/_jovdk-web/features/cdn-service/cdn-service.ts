export default class CdnService
{
    _isInitialized: boolean = false;
    _cdnBaseUrl: string = "";

    _onInitializedCallbacksList: Array<() => void> = new Array();

    constructor(cdnBaseUrl: string)
    {
        this._cdnBaseUrl = cdnBaseUrl;
        this._isInitialized = true;
    }


    SetOnInitializedCallback(onInitializedCallback: () => void): void
    {
        this._onInitializedCallbacksList.push(onInitializedCallback);
    }

    OnInitialized()
    {
        this._isInitialized = true;
        this._onInitializedCallbacksList.map(callback => callback());
    }

    SetCdnUrl(cdnBaseUrl: string)
    {
        this._cdnBaseUrl = cdnBaseUrl;
        this.OnInitialized();
    }

    GetContentUrl(contentPath: string): string
    {
        let value: string = "";

        let cdnBaseUrl = this.HandleCdnUrl(this._cdnBaseUrl);
        contentPath = this.HandleCdnUrl(contentPath);

        value = this._cdnBaseUrl + "/" + contentPath;

        return value;
    }


    HandleCdnUrl(cdnUrl: string)
    {
        let value: string = "";

        let hasSlashOnState = cdnUrl[cdnUrl.length - 1] == "/";

        if (hasSlashOnState)
            cdnUrl = cdnUrl.substring(0, cdnUrl.length - 1);

        value = cdnUrl;

        return value;
    }

    HandleContentPath(contentPath: string)
    {
        let value: string = "";

        let hasSlashOnState = contentPath[0] == "/";

        if (hasSlashOnState)
            contentPath = contentPath.substring(1);

        value = contentPath;

        return value;
    }
}
