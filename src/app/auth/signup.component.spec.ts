import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
    }).compileComponents();
  });

  it('creates and renders header text', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Create your account');
    expect(el.textContent).toContain('Join Gratistoria and start your daily gratitude practice');
  });

  it('keeps submit disabled until form is valid', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('form button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTrue();

    const email = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const username = fixture.debugElement.query(By.css('input#username')).nativeElement as HTMLInputElement;
    const password = fixture.debugElement.query(By.css('input#password')).nativeElement as HTMLInputElement;
    const password2 = fixture.debugElement.query(By.css('input#password2')).nativeElement as HTMLInputElement;

    email.value = 'user@example.com';
    email.dispatchEvent(new Event('input'));
    username.value = 'username8';
    username.dispatchEvent(new Event('input'));
    password.value = 'Secret1!';
    password.dispatchEvent(new Event('input'));
    password2.value = 'Secret1!';
    password2.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitBtn.disabled).toBeFalse();
  });

  it('shows mismatch error when passwords differ', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();

    const password = fixture.debugElement.query(By.css('input#password')).nativeElement as HTMLInputElement;
    const password2 = fixture.debugElement.query(By.css('input#password2')).nativeElement as HTMLInputElement;

    password.value = 'Secret1!';
    password.dispatchEvent(new Event('input'));
    password2.value = 'Different2!';
    password2.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Passwords do not match.');
  });

  it('submits, logs, and toggles loading state', fakeAsync(() => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();

    const email = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const username = fixture.debugElement.query(By.css('input#username')).nativeElement as HTMLInputElement;
    const password = fixture.debugElement.query(By.css('input#password')).nativeElement as HTMLInputElement;
    const password2 = fixture.debugElement.query(By.css('input#password2')).nativeElement as HTMLInputElement;

    email.value = 'user@example.com';
    email.dispatchEvent(new Event('input'));
    username.value = 'username8';
    username.dispatchEvent(new Event('input'));
    password.value = 'Secret1!';
    password.dispatchEvent(new Event('input'));
    password2.value = 'Secret1!';
    password2.dispatchEvent(new Event('input'));
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

