import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {RouterOutlet} from '@angular/router';

export type AuthMode = 'signin' | 'signup';

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

/**
 * AuthComponent
 * - Standalone Angular component that mirrors a typical React Auth component.
 * - Uses Reactive Forms, Tailwind-friendly markup, and clean Inputs/Outputs.
 * - No direct dependency on an AuthService; emits events instead so you can wire your own effects.
 *
 * React → Angular mapping
 * - Props            → @Input()
 * - Callback props   → @Output() EventEmitter
 * - Local state      → form controls / class fields
 * - useEffect        → ngOnInit / lifecycle hooks
 */
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  template: `
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl text-primary mb-2">Gratistoria</h1>
        <p class="text-gray-500">Your daily gratitude, woven into beautiful stories</p>
      </div>
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);

  /** UI text */
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() submitText?: string;

  /** Controls */
  @Input() initialMode: AuthMode = 'signin';
  @Input() loading = false;
  @Input() error: string | null = null;

  /** Events */
  @Output() signIn = new EventEmitter<SignInPayload>();
  @Output() signUp = new EventEmitter<SignUpPayload>();
  @Output() modeChange = new EventEmitter<AuthMode>();
  @Output() forgotPassword = new EventEmitter<string>();

  mode: AuthMode = 'signin';

  form = this.fb.group(
    {
      name: this.fb.control<string>('', []),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.control<string>(''),
      rememberMe: this.fb.control<boolean>(false),
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    this.mode = this.initialMode;
    this.applyMode(this.mode);
  }

  t(controlName: keyof AuthComponent['form']['controls']): AbstractControl {
    return this.form.get(controlName as string)!;
  }

  toggleMode(next: AuthMode): void {
    if (this.mode === next) return;
    this.mode = next;
    this.modeChange.emit(this.mode);
    this.applyMode(this.mode);
  }

  onForgotPassword(): void {
    const email = this.t('email').value as string;
    this.forgotPassword.emit(email);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.mode === 'signin') {
      const payload: SignInPayload = {
        email: this.t('email').value as string,
        password: this.t('password').value as string,
        rememberMe: !!this.t('rememberMe').value,
      };
      this.signIn.emit(payload);
    } else {
      const payload: SignUpPayload = {
        name: this.t('name').value as string,
        email: this.t('email').value as string,
        password: this.t('password').value as string,
      };
      this.signUp.emit(payload);
    }
  }

  private applyMode(mode: AuthMode): void {
    const name = this.t('name');
    const confirm = this.t('confirmPassword');
    const remember = this.t('rememberMe');

    if (mode === 'signup') {
      name.setValidators([Validators.required]);
      confirm.setValidators([Validators.required]);
      remember.clearValidators();
    } else {
      name.clearValidators();
      confirm.clearValidators();
      remember.clearValidators();
    }

    name.updateValueAndValidity();
    confirm.updateValueAndValidity();
    remember.updateValueAndValidity();

    // Reset cross-field errors when switching
    this.form.updateValueAndValidity();
  }
}

// --- Cross-field validator for password confirmation ---
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
  const group = control as any;
  const password: string | undefined = group.get?.('password')?.value;
  const confirm: string | undefined = group.get?.('confirmPassword')?.value;
  if (password && confirm && password !== confirm) {
    return { passwordMismatch: true };
  }
  return null;
};

/**
 * Usage example in a template:
 *
 * <app-auth
 *   [initialMode]="'signin'"
 *   [loading]="authLoading"
 *   [error]="authError"
 *   title="Welcome back"
 *   subtitle="Sign in to continue"
 *   (signIn)="handleSignIn($event)"
 *   (signUp)="handleSignUp($event)"
 *   (forgotPassword)="openResetDialog($event)"
 * />
 */
