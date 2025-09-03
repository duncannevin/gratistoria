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
      <app-card-content>
        <div class="mt-6 text-center space-y-2">

          <div class="text-sm">
            Sign back in
            <app-button
              variant="ghost"
              href="/auth/login"
            >
              Sign in!
            </app-button>
          </div>
        </div>
      </app-card-content>
    </app-card>
  `,
  imports: [...Card, ButtonComponent]
})
export class SignOutComponent {}
