import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guard';
import { FullAppComponent } from './full-app/full-app.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [guestGuard],
        component: LoginComponent,
    },
    {
        path: '',
        canActivate: [authGuard],
        component: FullAppComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
