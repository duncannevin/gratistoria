import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './user.actions';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { LoginResponseModel } from '@models/login-response.model';
import { UserModel } from '@models/user.model';
import { Router } from '@angular/router';
import { OverlayActions } from '../overlay/overlay.actions';
import {LocalStorageService} from '@services/local-storage.service';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  private readonly localStorage = inject(LocalStorageService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      switchMap(({ email, password }) =>
        this.auth.login(email, password).pipe(
          map((res: LoginResponseModel) => UserActions.loginSuccess({ user: res.user as UserModel })),
          catchError((err) => of(UserActions.loginFailure({ error: err?.message || 'Login failed' }))),
        )
      )
    )
  );

  loginNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap(() => this.router.navigateByUrl('/s/today')),
      ),
    { dispatch: false }
  );

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser, UserActions.loginSuccess),
      switchMap(() =>
        this.users.getUser().pipe(
          map((user) => UserActions.getUserSuccess({ user })),
          catchError((err) => of(UserActions.getUserFailure({ error: err?.message || 'Fetch user failed' }))),
        )
      )
    )
  );

  // Show overlay while fetching user
  getUserOverlayShow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      map(() => OverlayActions.show({ message: 'Logging you in...', icon: '🔐' }))
    )
  );

  getLogoutOverlayShow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logoutStart),
      map(() => OverlayActions.show({ message: 'Signing you out...', icon: '🚪' }))
    ),
  );

  // After login success, change overlay to loading experience while profile fetch happens
  loginSuccessOverlaySet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginSuccess),
      map(() => OverlayActions.show({ message: 'Loading your experience...', icon: '✨' }))
    )
  );

  // Hide overlay when user fetch completes or fails, or logout completes/fails
  getUserOverlayHide$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.loginFailure,
        UserActions.getUserSuccess,
        UserActions.getUserFailure,
        UserActions.logout,
        UserActions.logoutFailure,
      ),
      map(() => OverlayActions.hide())
    )
  );

  // On successful profile fetch: go to /s/today only if not already on a secure page
  userFetchedNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.getUserSuccess),
        tap(() => {
          const url = this.router.url || '';
          if (!url.startsWith('/s')) {
            this.router.navigateByUrl('/s/today');
          }
        }),
      ),
    { dispatch: false }
  );

  // On failed profile fetch: if attempting to access a secure page, go to login
  userFetchFailedNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.getUserFailure),
        tap(() => {
          const url = this.router.url || '';
          this.localStorage.removeItem('token');
          this.localStorage.removeItem('idToken');
          this.router.navigateByUrl('/auth');
        }),
      ),
    { dispatch: false }
  );

  // Logout: call API then clear store and route to login
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logoutStart),
      switchMap(() =>
        this.auth.logout().pipe(
          // Always proceed to client-side logout regardless of API result
          map(() => UserActions.logout()),
          catchError(() => of(UserActions.logout())),
        )
      )
    )
  );

  logoutNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.logout),
        tap(() => this.router.navigateByUrl('/auth/login')),
      ),
    { dispatch: false }
  );

  // Ensure tokens are cleared even if logout fails
  logoutClearTokens$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.logout),
        tap(() => {
          this.localStorage.removeItem('token');
          this.localStorage.removeItem('idToken');
        }),
      ),
    { dispatch: false }
  );
}
