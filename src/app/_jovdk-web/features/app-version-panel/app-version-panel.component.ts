import { Component } from '@angular/core';
import { AppEnvironmentHandler, EnviromentData, environment } from '../../../../environments/environment';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-version-panel',
    standalone: true,
    imports: [
        NgIf,
    ],
    templateUrl: './app-version-panel.component.html',
    styleUrl: './app-version-panel.component.css'
})
export class AppVersionPanelComponent {
    // dependencies
    _environmentData: EnviromentData = environment;

    // state
    _isProd = AppEnvironmentHandler.IsProd();
}
