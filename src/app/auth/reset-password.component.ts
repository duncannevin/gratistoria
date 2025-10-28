import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card, ButtonComponent, InputComponent } from '../common/components';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, ...Card, InputComponent],
  template: `
    <app-card>
      <app-card-header className="text-center">
        <app-card-title>Reset your password</app-card-title>
        <app-card-description>
          Enter your email, the verification code, and a new password
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

          <div class="space-y-2">
            <app-input
              formControlName="password"
              id="password"
              name="password"
              type="password"
              [required]="true"
              placeholder="••••••••"
              label="New Password"
              [errorText]="
                form.get('password')?.invalid && (form.get('password')?.touched || form.get('password')?.dirty)
                  ? 'Please enter a strong password.'
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
              {{ isLoading ? 'Resetting password...' : 'Reset Password' }}
            </app-button>

            <div class="mt-6 text-center space-y-2">
              <div class="text-sm">
                Remembered your password?
                <app-button variant="ghost" href="/auth/login">Sign in</app-button>
              </div>
            </div>
          </app-card-footer>
        </form>
      </app-card-content>
    </app-card>
  `,
})
export class ResetPasswordComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  form: FormGroup;

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
        ],
      ],
    });

    // Prefill from query params if present
    const qp = this.route.snapshot.queryParamMap;
    const email = qp.get('email');
    const code = qp.get('code');
    if (email) this.form.get('email')?.setValue(email);
    if (code) this.form.get('code')?.setValue(code);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.error = null;
    const { email, code, password } = this.form.value as any;
    this.auth.changePassword({ email, code, password }).subscribe({
      next: (res) => {
        if (res.ok) this.router.navigateByUrl('/auth/login');
        else this.error = 'Unable to reset password';
      },
      error: () => (this.error = 'Unable to reset password'),
      complete: () => (this.isLoading = false),
    });
  }
}
