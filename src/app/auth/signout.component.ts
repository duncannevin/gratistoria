import {Component, inject, OnInit} from '@angular/core';
import {Card} from '../common/components/card.component';
import {ButtonComponent} from '../common/components/button.component';
import {Store} from '@ngrx/store';
import {UserActions} from '../state/user.actions';
import {LocalStorageService} from '../services/local-storage.service';

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
export class SignOutComponent implements OnInit {
  private store = inject(Store);
  private localStorageService = inject(LocalStorageService);

  ngOnInit() {
    const token = this.localStorageService.getItem<string>('token');
    if (token) {
      this.store.dispatch(UserActions.logoutStart());
    } else {
      // No token present, just dispatch a plain logout
      this.store.dispatch(UserActions.logout());
    }
  }
}
