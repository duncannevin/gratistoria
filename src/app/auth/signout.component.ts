import {Component} from '@angular/core';
import {Card} from '../common/components/card.component';
import {ButtonComponent} from '../common/components/button.component';

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
export class SignOutComponent {}
