import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LoginComponent],
    }).compileComponents();
  });

  it('should create and render headings', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Welcome back');
    expect(el.textContent).toContain('Sign in to continue your gratitude journey');
  });

  it('keeps submit disabled until form is valid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    // Submit button inside app-button (native button is projected)
    const submitBtn = fixture.debugElement.query(By.css('form button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTrue();

    // Fill inputs via inner inputs rendered by app-input
    const emailEl = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const passEl = fixture.debugElement.query(By.css('input#password')).nativeElement as HTMLInputElement;
    emailEl.value = 'user@example.com';
    emailEl.dispatchEvent(new Event('input'));
    passEl.value = 'supersecret';
    passEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitBtn.disabled).toBeFalse();
  });

  it('submits, logs, and toggles loading state', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const emailEl = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const passEl = fixture.debugElement.query(By.css('input#password')).nativeElement as HTMLInputElement;
    emailEl.value = 'user@example.com';
    emailEl.dispatchEvent(new Event('input'));
    passEl.value = 'supersecret';
    passEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('form button[type="submit"]')).nativeElement as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    // Loading starts
    const cmp = fixture.componentInstance;
    expect(cmp.isLoading).toBeTrue();

    // Complete the timeout
    tick(900);
    fixture.detectChanges();
    expect(cmp.isLoading).toBeFalse();
  }));
});

