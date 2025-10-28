import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from './card.component';
import {DateTimePipe} from '@pipes/date-time.pipe';
import {Gratitude} from '@models/gratitude.model';
import {CalendarIcon, LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-diary-card',
  standalone: true,
  template: `
    <app-card className="hover:shadow-md transition-shadow w-[742px] max-w-full m-auto pt-3">
      <app-card-header>
        <app-card-description className="flex justify-between">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-muted-foreground pr-3">
              <lucide-icon [img]="CalendarIcon" [size]="16"></lucide-icon>
              <p>{{ gratitude.timestamp | appDateTime }}</p>
            </div>
          </div>
        </app-card-description>
      </app-card-header>

      <app-card-content>
        <div class="space-y-3">
          <p class="text-foreground leading-relaxed whitespace-pre-line">
            {{ gratitude.entry }}
          </p>
        </div>
      </app-card-content>
    </app-card>
  `,
  imports: [CommonModule, ...Card, DateTimePipe, LucideAngularModule]
})
export class DiaryCardComponent {
  @Input() gratitude!: Gratitude;
  protected readonly CalendarIcon = CalendarIcon;
}
