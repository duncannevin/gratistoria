import {Component, Input, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card, ButtonComponent, InputComponent} from '../common/components';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, ...Card, InputComponent],
  template: `
    <app-card>
      <app-card-header className="text-center">
        <app-card-title>Reset your password</app-card-title>
        <app-card-description>
          Enter your email address and we'll send you a reset link
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

          <app-card-footer>
            <app-button type="submit" variant="default" size="md" [full]="true"
                        [disabled]="isLoading || form.invalid">
              {{ isLoading ? 'Sending email...' : 'Submit' }}
            </app-button>

            <div class="mt-6 text-center space-y-2">
              <div class="text-sm">
                Back to login
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
export class ForgotPasswordComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  form: FormGroup;

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.error = null;
    const { email } = this.form.value as any;
    this.auth.forgotPassword(email).subscribe({
      next: () => this.router.navigateByUrl('/auth/confirmation-code'),
      error: (e) => {
        this.error = e?.message || 'Failed to send reset';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false,
    });
  }
}
