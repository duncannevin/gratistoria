import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Card} from '../common/components/card.component';
import {ButtonComponent} from '../common/components/button.component';
import {InputComponent} from '../common/components/input.component';

@Component({
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, ...Card, InputComponent],
  template: `
    <app-card>
      <app-card-header className="text-center">
        <app-card-title>Confirm your email</app-card-title>
        <app-card-description>
          Enter your email and the code to confirm
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

          <app-card-footer>
            <app-button type="submit" variant="default" size="md" [full]="true" [disabled]="isLoading || form.invalid">
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </app-button>

            <div class="mt-6 text-center space-y-2">
              <app-button
                size="sm"
                variant="link"
                href="/auth/forgot-password"
              >
                Back to forgot password
              </app-button>
            </div>
          </app-card-footer>
        </form>

      </app-card-content>
    </app-card>
  `,
})
export class ConfirmationCodeComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
    })
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;

    setTimeout(() => {
      console.log('CONFIRMATION CODE FORM:', this.form.value);
      this.isLoading = false;
    }, 800);
  }
}
