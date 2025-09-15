import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
// import { MyImgDirective } from '../../../../full-app/img.directive';
// import { ImageLoaderDirective } from '../../../../full-app/img.directive';
import { ImgLoadingDirective } from '../../custom-directives/img-loading.directive';
import { LocalizationService } from '../../../../_jovdk-web/features/localization-service/localization-service.service';

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ImgLoadingDirective,
    ],
    templateUrl: './nav-bar.component.html',
    // hostDirectives: [MyImgDirective],
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent
{

    // dependencies
    _localizationService: LocalizationService = inject(LocalizationService);

    // config
    // _allPossibleLanguageOptions: LanguageOption[] =
    //     [
    //         {
    //             Id: 'pt-br',
    //             Name: 'Português',
    //             FlagIconName: 'brazil-flag-icon-01',
    //         },
    //         {
    //             Id: 'pt-br',
    //             Name: 'Soon...',
    //             FlagIconName: 'usa-flag-icon-01',
    //         },
    //         // {
    //         //     Id: 'en-us',
    //         //     Name: 'English (US)',
    //         //     FlagIconName: 'usa-flag-icon-01',
    //         // },
    //     ];
    // _allPossibleLanguageOptionsById: { [key: string]: LanguageOption } = {};

    // state
    _isSelectingLanguage = false;

    constructor()
    {
        // this._allPossibleLanguageOptions.map(
        //     (languageOption) =>
        //     {
        //         if (!(languageOption.Id in this._allPossibleLanguageOptionsById))
        //             this._allPossibleLanguageOptionsById[languageOption.Id] = languageOption;
        //         else
        //         {
        //             // ! TODO: REVIEW THIS!
        //             // console.error(
        //             //     'Duplicated languageOption.Id!' +
        //             //     'languageOption.Id = ', languageOption.Id);
        //         }
        //     }
        // );

        // let languagePreferenceId: string | undefined = undefined;

        // TODO: handle languagePreference cache!

        // if (!languagePreferenceId)
        //     languagePreferenceId = this._allPossibleLanguageOptions[0].Id;

        // this._currentLanguageOption = this._allPossibleLanguageOptionsById[languagePreferenceId];
    }

    SetInitialState = () =>
    {

    }

    OpenLanguageSelectionButton = () =>
    {
        if (!this._isSelectingLanguage)
            this._isSelectingLanguage = true;
    }

    LanguageOptionButton = (lagunageId: string) =>
    {
        this._isSelectingLanguage = false;
        this._localizationService.SetCurrentLanguage(lagunageId);
    }
}

interface LanguageOption
{
    Id: string,
    Name: string,
    FlagIconName: string,
}
