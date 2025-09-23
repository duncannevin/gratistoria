import {Component, inject} from '@angular/core';
import {Card} from '../common/components/card.component';
import {ButtonComponent} from '../common/components/button.component';
import {AuthService} from '../services/auth.service';
import {Store} from '@ngrx/store';
import {UserActions} from '../state/user.actions';

@Component({
  standalone: true,
  template: `
    <app-card>
      <app-card-header>
        <app-card-description>
          You are now signed out!
        </app-card-description>
      </app-card-header>
      <app-card-footer>
        <div class="mt-6 text-center space-y-2">
          <app-button
            variant="default"
            href="/auth/login"
            [full]="true"
          >
            Sign in!
          </app-button>
        </div>
      </app-card-footer>
    </app-card>
  `,
  imports: [...Card, ButtonComponent]
})
export class SignOutComponent {
  private auth = inject(AuthService);
  private store = inject(Store);
  constructor() {
    // best-effort signout on page open
    this.auth.logout().subscribe({
      next: () => this.store.dispatch(UserActions.logout()),
    });
  }
}
