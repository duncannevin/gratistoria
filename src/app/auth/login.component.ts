import { Component, EventEmitter, Input, Output } from '@angular/core';
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
        <app-card-header>Welcome back</app-card-header>
        <app-card-title>
          Sign in to continue your gratitude journey
        </app-card-title>
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

          <div *ngIf="error" class="text-destructive text-sm text-center">
            {{ error }}
          </div>

          <app-button type="submit" variant="default" size="md" className="w-full" [disabled]="isLoading || form.invalid">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </app-button>
        </form>

        <div class="mt-6 text-center space-y-2">
          <app-button
            (click)="onSwitchToForgotPassword()"
            size="sm"
            variant="link"
            className="text-gray-500"
          >
            Forgot your password?
          </app-button>

          <div class="text-sm text-gray-500">
            Don't have an account?
            <app-button
              (click)="onSwitchToSignup()"
              variant="ghost"
            >
              Sign up
            </app-button>
          </div>
        </div>
      </app-card-content>
    </app-card>
  `,
})
export class LoginComponent {
  @Input() error: string | null = null;
  @Input() isLoading = false;

  @Output() submitCredentials = new EventEmitter<{ email: string; password: string }>();
  @Output() switchToForgotPassword = new EventEmitter<void>();
  @Output() switchToSignup = new EventEmitter<void>();

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;

    setTimeout(() => {
      console.log('SIGN IN FORM:', this.form.value);
      this.isLoading = false;
    }, 800);
  }

  onSwitchToForgotPassword() {
    this.switchToForgotPassword.emit();
  }

  onSwitchToSignup() {
    this.switchToSignup.emit();
  }
}
