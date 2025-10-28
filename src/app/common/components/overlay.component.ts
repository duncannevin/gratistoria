import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectMessage, selectVisible, selectIcon } from '../../state';

@Component({
  selector: 'app-overlay',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center text-muted-foreground">
              <div class="text-3xl mb-3">{{ icon() || '💖' }}</div>
          <div>{{ message() || 'Loading your experience...' }}</div>
        </div>
      </div>
    }
  `,
})
export class OverlayComponent {
  private store = inject(Store);

  readonly visible = toSignal(this.store.select(selectVisible), { initialValue: false });
  readonly message = toSignal(this.store.select(selectMessage), { initialValue: null });
  readonly icon = toSignal(this.store.select(selectIcon), { initialValue: null });
}
