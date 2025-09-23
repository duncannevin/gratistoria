import {Component, Input, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card} from '../common/components/card.component';
import {ButtonComponent} from '../common/components/button.component';
import {InputComponent} from '../common/components/input.component';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, ...Card, InputComponent],
  template: `
    <app-card>
      <app-card-header className="text-center">
        <app-card-title>Change your password</app-card-title>
        <app-card-description>
          Strong passwords keep your account safe. It only takes a minute.
        </app-card-description>
      </app-card-header>

      <app-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="space-y-2">
            <app-input
              formControlName="email"
              id="email"
              name="email"
              type="email"
              [required]="true"
              placeholder="your@email.com"
              label="Email"
              [errorText]="
                form.get('email')?.invalid && (form.get('email')?.touched || form.get('email')?.dirty)
                  ? 'Please enter a valid email.'
                  : undefined
              "
            ></app-input>
          </div>

          <div class="space-y-2">
            <app-input
              formControlName="password"
              id="password"
              name="password"
              type="password"
              [required]="true"
              placeholder="••••••••"
              label="Password"
              [errorText]="
                form.get('password')?.invalid && (form.get('password')?.touched || form.get('password')?.dirty)
                  ? 'Please enter a valid password.'
                  : undefined
              "
            ></app-input>
          </div>

          <div class="space-y-2">
            <app-input
              formControlName="code"
              id="code"
              name="code"
              type="text"
              [required]="true"
              placeholder="123456"
              label="Code"
              [errorText]="
                form.get('code')?.invalid && (form.get('code')?.touched || form.get('code')?.dirty)
                  ? 'Code is required.'
                  : undefined
              "
            ></app-input>
          </div>

          <div *ngIf="error" class="text-destructive text-sm text-center">
            {{ error }}
          </div>

          <app-card-footer>
            <app-button type="submit" variant="default" size="md" [full]="true"
                        [disabled]="isLoading || form.invalid">
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </app-button>

            <div class="mt-6 text-center space-y-2">
              <div class="text-sm">
                Already have an account?
                <app-button
                  variant="ghost"
                  href="/auth/login"
                >
                  Sign in
                </app-button>
              </div>
            </div>
          </app-card-footer>
        </form>
      </app-card-content>
    </app-card>
  `,
})
export class ChangePasswordComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  form: FormGroup;

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.error = null;
    const { email, code, password } = this.form.value as any;
    this.auth.changePassword({ email, password, code }).subscribe({
      next: (res) => {
        if (res.ok) this.router.navigateByUrl('/auth/login');
        else this.error = 'Invalid email or code';
      },
      error: () => { this.error = 'Unable to change password'; },
      complete: () => { this.isLoading = false; },
    });
  }
}
