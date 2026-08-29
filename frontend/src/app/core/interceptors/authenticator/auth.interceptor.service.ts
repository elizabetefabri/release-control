import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Anexa o JWT (Bearer) em toda chamada à API e trata 401:
 * sessão expirada → limpa o estado local e redireciona para /login.
 */
export const AuthInterceptorService: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthRoute = req.url.includes('/api/v1/auth/');

  const request =
    isApiRequest && auth.token && !isAuthRoute
      ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } })
      : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApiRequest && !isAuthRoute && error.status === 401) {
        auth.clearSession();
        auth.redirectToLogin(router.url);
      }
      return throwError(() => error);
    }),
  );
};
