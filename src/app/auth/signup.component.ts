import {Component, Input, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card, ButtonComponent, InputComponent} from '@components';
import {AuthService} from '@services/auth.service';
import {Router} from '@angular/router';

@Component({
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, ...Card, InputComponent],
  template: `
    <app-card>
      <app-card-header className="text-center">
        <app-card-title>Create your account</app-card-title>
        <app-card-description>
          Join Gratistoria and start your daily gratitude practice
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
              formControlName="username"
              id="username"
              name="username"
              type="text"
              [required]="true"
              placeholder="sally.mac"
              label="Username"
              [errorText]="
                form.get('username')?.invalid && (form.get('username')?.touched || form.get('username')?.dirty)
                  ? 'Please enter a valid username.'
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
              formControlName="password2"
              id="password2"
              name="password2"
              type="password"
              [required]="true"
              placeholder="••••••••"
              label="Confirm Password"
              [errorText]="
                form.get('password2')?.invalid && (form.get('password2')?.touched || form.get('password2')?.dirty)
                  ? 'Passwords do not match.'
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
export class SignupComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  form: FormGroup;

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      password2: ['', [Validators.required]],
    });
    this.form.addValidators(this.passwordMatchValidator(this.form));
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.error = null;
    const { email, username, password } = this.form.value as any;
    this.auth.signup({ email, name: username, password }).subscribe({
      next: () => this.router.navigateByUrl('/auth/confirmation-code'),
      error: (e) => {
        this.error = e?.message || 'Sign up failed';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false,
    });
  }

  passwordMatchValidator(group: FormGroup) {
    return (_control: AbstractControl) => {
      const password1 = group.controls['password'];
      const password2 = group.controls['password2'];

      const isValid =
        password1 && password2 && password1.value === password2.value
          ? null
          : {passwordMismatch: true};

      if (isValid) {
        password2.setErrors({...password2.errors, passwordMismatch: true});
      } else {
        password2.setErrors(null);
      }

      return null;
    };
  }
}
