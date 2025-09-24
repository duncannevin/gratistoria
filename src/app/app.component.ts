import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserActions } from './state/user.actions';
import { selectResolved } from './state/user.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (!resolved()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center text-muted-foreground">
          <div class="text-3xl mb-3">✨</div>
          <div>Loading your experience...</div>
        </div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  standalone: true,
  })
export class AppComponent implements OnInit {
  title = 'gratistoria';

  private store = inject(Store);
  private storage = inject(LocalStorageService);
  readonly resolved = toSignal(this.store.select(selectResolved), { initialValue: false });

  ngOnInit() {
    // Only attempt fetch if a token exists; else mark as resolved unauthenticated
    const token = this.storage.getItem<string>('token');
    if (token) {
      this.store.dispatch(UserActions.getUser());
    } else {
      this.store.dispatch(UserActions.getUserFailure({ error: 'No token' }));
    }
  }
}
