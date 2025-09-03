import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
    }).compileComponents();
  });

  it('creates and renders header text', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Reset your password');
    expect(el.textContent).toContain("Enter your email address and we'll send you a reset link");
  });

  it('keeps submit disabled until email is valid', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('form button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTrue();

    const emailEl = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;

    // invalid email keeps disabled
    emailEl.value = 'invalid';
    emailEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submitBtn.disabled).toBeTrue();

    // valid email enables submit
    emailEl.value = 'user@example.com';
    emailEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submitBtn.disabled).toBeFalse();
  });

  it('shows error text for invalid email after dirty/touched', () => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();

    const emailEl = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    emailEl.value = 'invalid';
    emailEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Please enter a valid email.');
  });

  it('submits, logs, and toggles loading state', fakeAsync(() => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();

    const emailEl = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    emailEl.value = 'user@example.com';
    emailEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const logSpy = spyOn(console, 'log');

    const submitBtn = fixture.debugElement.query(By.css('form button[type="submit"]')).nativeElement as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    const cmp = fixture.componentInstance;
    expect(cmp.isLoading).toBeTrue();

    tick(900);
    fixture.detectChanges();
    expect(cmp.isLoading).toBeFalse();
    expect(logSpy).toHaveBeenCalled();
  }));
});

