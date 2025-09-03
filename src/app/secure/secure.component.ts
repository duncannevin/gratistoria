import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ButtonComponent} from '../common/components/button.component';
import {UrlButtonComponent} from '../common/components/url-button.component';

@Component({
  standalone: true,
  template: `
    <nav class="bg-card border-b border-border">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl text-primary">Gratistoria</h1>

            <div class="flex space-x-6">
              <app-url-button
                path="/s/today">
                <app-button
                  href="/s/today"
                  variant="secondary">
                  Today&#39;s Entry
                </app-button>
              </app-url-button>

              <app-url-button
                path="/s/stories">
                <app-button
                  href="/s/stories"
                  variant="secondary">
                  Stories
                </app-button>
              </app-url-button>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-muted-foreground">
              Welcome, TODO
            </span>
            <app-button
              href="/auth/signout"
              class="text-sm inline-flex items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">
              Sign out
            </app-button>
          </div>
        </div>
      </div>
    </nav>
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
      <router-outlet></router-outlet>
    </div>
    </div>
  `,
  imports: [ButtonComponent, CommonModule, RouterModule, UrlButtonComponent],
})
export class SecureComponent {}
