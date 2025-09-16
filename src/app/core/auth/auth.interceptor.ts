import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();
    const authenticatedRequest = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authenticatedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.handleUnauthorized();
            }
            return throwError(() => error);
        }),
    );
};
