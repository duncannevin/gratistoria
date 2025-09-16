import {Component, HostBinding, Input} from '@angular/core';
import {CommonModule} from '@angular/common';


/**
 * Card primitives styled to match the screenshot:
 * - Softer 16px radius (rounded-2xl)
 * - Subtle border and shadow
 * - Centered header with title + muted subtitle
 * - Spacious content
 *
 * Tip: wrap <app-card> with a container like `max-w-sm mx-auto` for the same width.
 */


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="class">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() className = ''
  private baseClass = 'bg-card w-[542px] max-w-full mx-auto p-6 rounded-2xl shadow border border-gray-200';

  get class() {
    return this.baseClass + ' ' + this.className;
  }
}


@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="class">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {
  @Input() className = ''
  private baseClass = 'flex flex-col items-center';

  get class() {
    return this.baseClass + ' ' + this.baseClass;
  }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [ngClass]="class">
      <ng-content></ng-content>
    </p>
  `,
})
export class CardTitleComponent {
  @Input() className = ''
  private baseClass = 'space-y-1.5 font-semibold leading-none tracking-tight';

  get class() {
    return this.baseClass + ' ' + this.className;
  }
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [ngClass]="class">
        <ng-content></ng-content>
    </p>
  `,
})
export class CardDescriptionComponent {
  @HostBinding('class') hostClass = 'block w-full';
  @Input() className = ''
  private baseClass = 'text-sm w-full leading-none py-2 w-full';

  get class() {
    return this.baseClass + ' ' + this.className;
  }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="class">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardContentComponent {
  @Input() className = ''
  private baseClass = 'pt-6';

  get class() {
    return this.baseClass + ' ' + this.baseClass;
  }
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="class">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardFooterComponent {
  @Input() className = ''
  private baseClass = 'pt-4';

  get class() {
    return this.baseClass + ' ' + this.baseClass;
  }
}


export const Card = [
  CardComponent,
  CardDescriptionComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent,
];
