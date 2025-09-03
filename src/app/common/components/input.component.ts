// ui-input.component.ts
import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div [class]="containerClass">
      <label *ngIf="label"
             [attr.for]="id"
             [class]="labelClass">
        {{ label }} <span *ngIf="required" class="text-red-600" aria-hidden="true">*</span>
      </label>

      <input
        [id]="id"
        [attr.name]="name || null"
        [type]="type"
        [attr.placeholder]="placeholder || null"
        [attr.autocomplete]="autocomplete || null"
        [attr.inputmode]="inputmode || null"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouch()"
        [attr.aria-invalid]="ariaInvalid || (errorText ? 'true' : null)"
        [attr.aria-describedby]="describedBy"
        [class]="inputClass"
      />

      <p *ngIf="helpText" class="text-xs text-neutral-500" [id]="id + '-help'">{{ helpText }}</p>
      <p *ngIf="errorText" class="text-xs text-red-600" [id]="id + '-error'">{{ errorText }}</p>
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  // Visual + content inputs
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'search' = 'text';
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() inputmode?: string; // e.g., "email", "numeric", "decimal"
  @Input() helpText?: string;
  @Input() errorText?: string;

  // State & a11y
  @Input() required = false;
  @Input() disabled = false;
  @Input() ariaInvalid?: 'true' | 'false';
  @Input() id = `input-${Math.random().toString(36).slice(2, 9)}`;

  // Style hooks (override as needed)
  @Input() containerClass =
    'space-y-2';
  @Input() labelClass =
    'block text-sm font-medium text-foreground';
  @Input() inputClass =
    'flex h-10 w-full rounded-md border-none bg-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  // CVA wiring
  value: string | number | null = '';

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onTouch() {
    this.onTouched();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  get describedBy(): string | null {
    const ids: string[] = [];
    if (this.helpText) ids.push(this.id + '-help');
    if (this.errorText) ids.push(this.id + '-error');
    return ids.length ? ids.join(' ') : null;
  }
}
