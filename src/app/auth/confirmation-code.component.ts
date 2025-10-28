import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Card, ButtonComponent, InputComponent} from '../common/components';
import {AuthService} from '@services/auth.service';
import {Router} from '@angular/router';

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
              {{ isLoading ? 'Confirming the code...' : 'Confirm' }}
            </app-button>

            <div class="mt-6 text-center space-y-2">
              <app-button
                size="sm"
                variant="link"
                href="/auth/login"
              >
                Back to login
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

  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
    })
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.error = null;
    const { email, code } = this.form.value as any;
    this.auth.verifyToken(email, code).subscribe({
      next: (res) => {
        if (res.valid) this.router.navigateByUrl('/auth/change-password');
        else this.error = 'Invalid code';
      },
      error: () => { this.error = 'Unable to confirm code'; },
      complete: () => { this.isLoading = false; },
    });
  }
}
