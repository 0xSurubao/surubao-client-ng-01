import { Component } from '@angular/core';
import { EnviromentData, environment } from '../../../../environments/environment';

@Component({
    selector: 'app-version-panel',
    standalone: true,
    imports: [],
    templateUrl: './app-version-panel.component.html',
    styleUrl: './app-version-panel.component.css'
})
export class AppVersionPanelComponent {
    // dependencies
    _environmentData: EnviromentData = environment;

}
