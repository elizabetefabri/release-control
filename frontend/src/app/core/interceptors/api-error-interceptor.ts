import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor funcional que padroniza erros de chamadas à API.
 * Extrai a mensagem do envelope `{ success, error }` do backend quando
 * disponível, e loga a falha no console para facilitar debug local.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message: string =
        error.error?.error ?? error.message ?? 'Erro inesperado ao comunicar com a API.';

      console.error(`[API] ${req.method} ${req.url} → ${error.status}: ${message}`);

      return throwError(() => new Error(message));
    }),
  );
};
