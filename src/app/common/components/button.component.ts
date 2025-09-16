import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

export const BUTTON_VARIANTS = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border border-input hover:bg-accent",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "text-primary hover:underline",
  link: "text-sm text-muted-foreground underline",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export const BUTTON_SIZES = {
  sm: "rounded-md px-2 py-1 text-sm",
  md: "rounded-md px-4 py-2 text-md",       // alias of default
  lg: "rounded-md px-8 py-4 text-lg",
  icon: "h-10 w-10",
} as const;

export type ButtonSize = keyof typeof BUTTON_SIZES;

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- define the single projection point once -->
    <ng-template #projected>
      <ng-content></ng-content>
    </ng-template>

    <a
      *ngIf="href; else nativeBtn"
      [href]="href!"
      [attr.target]="target || null"
      [attr.rel]="rel || (target === '_blank' ? 'noopener noreferrer' : null)"
      [attr.aria-disabled]="disabled ? 'true' : null"
      [attr.tabindex]="disabled ? -1 : null"
      (click)="onAnchorClick($event)"
      [ngClass]="class"
    >
      <ng-container [ngTemplateOutlet]="projected"></ng-container>
    </a>

    <ng-template #nativeBtn>
      <button
        [type]="type"
        [disabled]="disabled"
        (click)="onButtonClick($event)"
        [ngClass]="class"
      >
        <ng-container [ngTemplateOutlet]="projected"></ng-container>
      </button>
    </ng-template>
  `
})
export class ButtonComponent {
  @Input() href?: string;
  @Input() target?: string;
  @Input() rel?: string;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  private baseClass = 'flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none';
  private _size = '';
  private _variant = '';

  get class() {
    return this.baseClass + ' ' + this._size + ' ' + this._variant;
  }

  @Input() set size(s: ButtonSize) {
    this._size += ` ${BUTTON_SIZES[s]}`;
  }

  @Input() set variant(v: ButtonVariant) {
    this._variant += ` ${BUTTON_VARIANTS[v]}`;
  }

  @Input() set full(isIt: boolean) {
    if (isIt) {
      this.baseClass += ' w-full';
    }
  }

  @Output() pressed = new EventEmitter<Event>();

  onAnchorClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    if (this.href && this.href.startsWith('#')) {
      const el = document.querySelector(this.href);
      if (el) {
        event.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    this.pressed.emit(event);
  }

  onButtonClick(event: MouseEvent) {
    if (this.disabled) return;
    this.pressed.emit(event);
  }
}
