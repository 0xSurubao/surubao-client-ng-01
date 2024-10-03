// base libs
import { Component } from '@angular/core';

// third
// ...

// from project
import { environment } from '../../environments/environment';
import { EnviromentData } from '../../environments/environment';

@Component({
    selector: 'full-app',
    standalone: true,
    imports: [],
    templateUrl: './full-app.component.html',
    styleUrl: './full-app.component.css'
})
export class FullAppComponent {
    // dependencies
    _environmentData: EnviromentData = environment;
}
