// abstract-stateful.ts
import { computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {BehaviorSubject, catchError, Observable, of, defer} from 'rxjs';
import { switchMap, map, startWith, shareReplay, distinctUntilChanged, delay } from 'rxjs/operators';

/**
 * Generic stateful base. Subclasses implement `fetchState(...args)`.
 * - Pure streams (no side effects)
 * - Works with Promise<T> or Observable<T>
 * - Treats `null` as `not-found`
 * - Exposes ready-to-use Signals: `state`, `loading`, `value`, `error`
 */
export abstract class Stateful<T, Args extends unknown[] = []> {
  private readonly args$ = new BehaviorSubject<Args>([] as unknown as Args);

  readonly state$ = this.args$.pipe(
    // Defer the first emission to the next macrotask so that
    // subclass field initializers (e.g., injected services) are ready
    delay(0),
    switchMap((args) => defer(() => this.fetchState()).pipe(
      map((state) =>
        state === null ?
          { kind: 'not-found' } as const :
          { kind: 'success', value: state } as const
      ),
      catchError((err) => of({ kind: 'error' } as const)),
    )),
    distinctUntilChanged(),
    startWith({ kind: 'loading' } as const),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // inside your abstract Stateful/AbstractStateful class

  readonly state = toSignal(this.state$, { initialValue: { kind: 'loading' } as const });

  readonly value = computed<T | null>(() => {
    const s = this.state();                 // capture once -> allows narrowing
    return s.kind === 'success' ? s.value : null;
  });

  readonly loading = computed(() => this.state().kind === 'loading');

  readonly error = computed<string | null>(() => {
    const s = this.state();
    return s.kind === 'error' ? 'Cannot load state'
      : s.kind === 'not-found' ? 'Not found'
        : null;
  });


  protected abstract fetchState(): Observable<T | null>;

  protected withInitialArgs(...args: Args) { this.args$.next(args); }
  setArgs(...args: Args) { this.args$.next(args); }
  refresh() { const v = this.args$.getValue(); if (v) this.args$.next(v); }
}
