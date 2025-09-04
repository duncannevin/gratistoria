import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from './card.component';

@Component({
  selector: 'app-pulse-card',
  standalone: true,
  template: `
    <app-card [className]="class">
      <app-card-header>
        <div class="h-6 bg-muted rounded mb-2"></div>
        <div class="h-4 bg-muted rounded w-1/3"></div>
      </app-card-header>
      <app-card-content>
        <div class="space-y-2">
          <div class="h-4 bg-muted rounded"></div>
          <div class="h-4 bg-muted rounded"></div>
          <div class="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </app-card-content>
    </app-card>
  `,
  imports: [CommonModule, ...Card],
})
export class PulseCardComponent {
  @Input() width = 698;
  @Input() height = 598;

  get class() {
    return `animate-pulse ${this.width}px ${this.height}px`;
  }
}
