import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from './card.component';
import {DateTimePipe} from '../pipes/date-time.pipe';
import {BadgeComponent} from './badge.component';
import {Gratitude} from '../models/gratitude.model';
import {MoodPipePipe} from '../pipes/mood.pipe';
import {ButtonComponent} from './button.component';
import {CalendarIcon, HeartIcon, LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-diary-card',
  standalone: true,
  template: `
    <app-card className="hover:shadow-md transition-shadow w-[742px] max-w-full m-auto pt-3">
      <app-card-header>
        <app-card-description>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <lucide-icon [img]="CalendarIcon" [size]="16"></lucide-icon><p>{{ gratitude.date | appDateTime }}</p>
            </div>

            <app-badge variant="default" className="flex items-center gap-1">
              <span>{{ gratitude.mood | appMoodPipe }}</span>
              <span class="capitalize">{{ gratitude.mood }}</span>
            </app-badge>

            <app-button variant="outline" size="sm">
              <lucide-icon [img]="HeartIcon" [size]="16"></lucide-icon>
              <span>View Story</span>
            </app-button>
          </div>
        </app-card-description>
      </app-card-header>
    </app-card>
  `,
  imports: [BadgeComponent, ButtonComponent, CommonModule, ...Card, DateTimePipe, LucideAngularModule, MoodPipePipe]
})
export class DiaryCardComponent {
  @Input() gratitude!: Gratitude;
  protected readonly CalendarIcon = CalendarIcon;
  protected readonly HeartIcon = HeartIcon;
}
