import {Component, HostBinding, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, startWith, tap} from 'rxjs';

@Component({
  selector: 'app-url-button',
  standalone: true,
  template: `
    <span
      class="border-black pb-2"
      [ngClass]="(showUnderline$ | async) ? 'border-b-2' : ''"
    >
      <ng-content></ng-content>
    </span>
  `,
  imports: [CommonModule, RouterModule],
})
export class UrlButtonComponent {
  private readonly inputPath$ = new BehaviorSubject<string>('');

  @Input() set path(v: string) {
    this.inputPath$.next(v || '');
  }

  path$: Observable<string>;

  showUnderline$: Observable<boolean>;

  constructor(
    private readonly router: Router,
  ) {
    this.path$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null), // emit once for the initial load
      map(() => this.router.url.split(/[?#]/)[0]), // strip ?query and #hash
      distinctUntilChanged()
    );

    this.showUnderline$ = combineLatest([this.path$, this.inputPath$]).pipe(
      map(([current, target]) => !!target && (current === target || current.startsWith(target + '/'))),
      tap(console.log),
      distinctUntilChanged(),
    );
  }
}
