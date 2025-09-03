import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card} from '../common/components/card.component';
import {ButtonComponent} from '../common/components/button.component';
import {InputComponent} from '../common/components/input.component';
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

          <app-button type="submit" variant="default" size="md" className="w-full"
                      [disabled]="isLoading || form.invalid">
            {{ isLoading ? 'Sending email...' : 'Submit' }}
          </app-button>
        </form>

        <div class="mt-6 text-center space-y-2">

          <div class="text-sm text-gray-500">
            Back to login
            <app-button
              variant="ghost"
              href="/auth/login"
            >
              Sign in
            </app-button>
          </div>
        </div>
      </app-card-content>
    </app-card>
  `,
})
export class ForgotPasswordComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  form: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly router: Router) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;

    setTimeout(() => {
      console.log('Forgot password FORM:', this.form.value);
      this.isLoading = false;
    }, 800);
  }
}
