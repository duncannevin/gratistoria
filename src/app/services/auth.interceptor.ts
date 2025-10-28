import { HttpErrorResponse, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { Subject } from 'rxjs';

let refreshInProgress = false;
const refreshSubject = new Subject<string | null>();

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const storage = inject(LocalStorageService);
  const auth = inject(AuthService);

  // Attach Authorization header if token exists
  const token = storage.getItem<string>('token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: (req.headers || new HttpHeaders()).set('Authorization', `Bearer ${token}`),
    });
  }

  return next(authReq).pipe(
    catchError((err: unknown) => {
      const httpErr = err as HttpErrorResponse;
      const isAuthError = httpErr.status === 401 || httpErr.status === 403;
      const isRefreshCall = authReq.url.includes('/refresh-token');
      const isLogoutCall = authReq.url.includes('/logout');
      if (!isAuthError || isRefreshCall || isLogoutCall) {
        return throwError(() => err);
      }

      // Attempt token refresh
      if (refreshInProgress) {
        // wait for ongoing refresh
        return refreshSubject.pipe(
          filter((t): t is string => !!t),
          take(1),
          switchMap((newToken) => {
            const retryReq = authReq.clone({
              headers: (authReq.headers || new HttpHeaders()).set('Authorization', `Bearer ${newToken}`),
            });
            return next(retryReq);
          })
        );
      } else {
        refreshInProgress = true;
        return auth.refreshToken().pipe(
          switchMap((res) => {
            const newToken = storage.getItem<string>('token');
            refreshInProgress = false;
            refreshSubject.next(newToken || null);
            if (newToken) {
              const retryReq = authReq.clone({
                headers: (authReq.headers || new HttpHeaders()).set('Authorization', `Bearer ${newToken}`),
              });
              return next(retryReq);
            }
            return throwError(() => err);
          }),
          catchError((refreshErr) => {
            refreshInProgress = false;
            refreshSubject.next(null);
            return throwError(() => refreshErr);
          })
        );
      }
    })
  );
};
