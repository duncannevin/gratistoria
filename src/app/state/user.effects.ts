import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './user.actions';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { LoginResponseModel } from '../models/login-response.model';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { OverlayActions } from './overlay.actions';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);

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
      ofType(UserActions.login, UserActions.logoutStart),
      map(() => OverlayActions.show({ message: 'Loading your experience...' }))
    )
  );

  // Hide overlay when user fetch completes
  getUserOverlayHide$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loginFailure, UserActions.loginSuccess, UserActions.logout, UserActions.logoutFailure),
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
          map(() => UserActions.logout()),
          catchError((err) => of(UserActions.logoutFailure({ error: err?.message || 'Logout failed' }))),
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
}
