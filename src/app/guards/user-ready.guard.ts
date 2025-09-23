import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectResolved } from '../state/user.selectors';
import { filter, map, take } from 'rxjs/operators';

export const userReadyGuard: CanActivateFn = () => {
  const store = inject(Store);
  return store.select(selectResolved).pipe(
    filter((resolved) => resolved === true),
    take(1),
    map(() => true),
  );
};
