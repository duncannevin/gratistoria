import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './user.actions';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { LoginResponseModel } from '../models/login-response.model';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';

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

  // Navigate to today whenever a user profile is successfully fetched
  userFetchedNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.getUserSuccess),
        tap(() => this.router.navigateByUrl('/s/today')),
      ),
    { dispatch: false }
  );

}
