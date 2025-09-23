import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserModel } from '../models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: UserModel }>(),
    'Login Failure': props<{ error: string }>(),
    'Get User': emptyProps(),
    'Get User Success': props<{ user: UserModel }>(),
    'Get User Failure': props<{ error: string }>(),
    'Logout Start': emptyProps(),
    'Logout': emptyProps(),
    'Logout Failure': props<{ error: string }>(),
  },
});
