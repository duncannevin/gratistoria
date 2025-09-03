// File: src/app/components/badge.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span data-slot="badge" [ngClass]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  @Input() className = '';

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center rounded-full border';
    const variantClasses: Record<string, string> = {
      default: 'border-neutral-200 bg-neutral-50 text-neutral-800 text-xs px-2.5 py-1',
      secondary: 'border-secondary-200 bg-secondary-50 text-neutral-800 text-xs px-2.5 py-1',
      destructive: 'border-transparent bg-destructive text-white hover:bg-destructive90 focus-visible:ring-destructive20 dark:focus-visible:ring-destructive40 dark:bg-destructive60',
      outline: 'text-foreground hover:bg-accent hover:text-accent-foreground'
    };
    return `${baseClasses} ${variantClasses[this.variant] || variantClasses['default']} ${this.className}`;
  }
}
