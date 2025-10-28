import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ButtonComponent, UrlButtonComponent} from '@components';
import {toSignal} from '@angular/core/rxjs-interop';
import {Store} from '@ngrx/store';
import {selectUser} from '@state';

@Component({
  selector: 'app-secure',
  standalone: true,
  template: `
    <nav class="bg-card border-b border-border fixed left-0 right-0">
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
                path="/s/diary">
                <app-button
                  href="/s/diary"
                  variant="secondary">
                  My Diary
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
              Welcome, {{ userName() }}
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

    <div class="flex flex-col justify-center min-h-screen">
      <div class="mt-20 flex-1">
        <router-outlet></router-outlet>
      </div>

      <footer class="border-t border-border bg-card mt-8 flex-1">
        <div class="max-w-4xl mx-auto px-6 py-6">
          <p class="text-center text-sm text-muted-foreground">
            Gratistoria helps you cultivate daily gratitude and connects you with a community of appreciation.<br/>
            Your entries contribute to collective stories while keeping your personal details private.
          </p>
        </div>
      </footer>
    </div>
  `,
  imports: [ButtonComponent, CommonModule, RouterModule, UrlButtonComponent],
})
export class SecureComponent {
  private store = inject(Store);
  private userSel = toSignal(this.store.select(selectUser));

  userName = computed(() => this.userSel()?.name)
}
