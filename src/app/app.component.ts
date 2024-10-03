import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullAppComponent } from "./full-app/full-app.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullAppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'base-angular-projects-01';
}
