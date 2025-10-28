import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserActions, selectVisible, selectMessage } from './state';
import { OverlayComponent } from './common/components/overlay.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OverlayComponent],
  template: `
    @if (overlayVisible()) {
      <app-overlay></app-overlay>
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
  readonly overlayVisible = toSignal(this.store.select(selectVisible), { initialValue: false });
  readonly overlayMessage = toSignal(this.store.select(selectMessage), { initialValue: null });

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
