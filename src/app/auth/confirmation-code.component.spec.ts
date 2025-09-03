import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmationCodeComponent } from './confirmation-code.component';

describe('ConfirmationCodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationCodeComponent],
    }).compileComponents();
  });

  it('creates and renders header text', () => {
    const fixture = TestBed.createComponent(ConfirmationCodeComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Confirm your email');
    expect(el.textContent).toContain('Enter your email and the code to confirm');
  });

  it('keeps submit disabled until form is valid', () => {
    const fixture = TestBed.createComponent(ConfirmationCodeComponent);
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('form button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTrue();

    const email = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const code = fixture.debugElement.query(By.css('input#code')).nativeElement as HTMLInputElement;

    email.value = 'user@example.com';
    email.dispatchEvent(new Event('input'));
    code.value = '123456';
    code.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(submitBtn.disabled).toBeFalse();
  });

  it('shows errors for invalid email and required code', () => {
    const fixture = TestBed.createComponent(ConfirmationCodeComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    const email = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const code = fixture.debugElement.query(By.css('input#code')).nativeElement as HTMLInputElement;

    email.value = 'invalid';
    email.dispatchEvent(new Event('input'));
    code.value = '';
    code.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(el.textContent).toContain('Please enter a valid email.');
    expect(el.textContent).toContain('Code is required.');
  });

  it('submits, logs, and toggles loading state', fakeAsync(() => {
    const fixture = TestBed.createComponent(ConfirmationCodeComponent);
    fixture.detectChanges();

    const email = fixture.debugElement.query(By.css('input#email')).nativeElement as HTMLInputElement;
    const code = fixture.debugElement.query(By.css('input#code')).nativeElement as HTMLInputElement;

    email.value = 'user@example.com';
    email.dispatchEvent(new Event('input'));
    code.value = '123456';
    code.dispatchEvent(new Event('input'));
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

