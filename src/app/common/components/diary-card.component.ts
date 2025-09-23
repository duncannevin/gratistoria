import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from './card.component';
import {DateTimePipe} from '../pipes/date-time.pipe';
import {BadgeComponent} from './badge.component';
import {Gratitude} from '../../models/gratitude.model';
import {MoodPipePipe} from '../pipes/mood.pipe';
import {ButtonComponent} from './button.component';
import {BookOpen, CalendarIcon, HeartIcon, LucideAngularModule} from 'lucide-angular';
import {Story} from '../../models/story.model';

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
              <p>{{ gratitude.date | appDateTime }}</p>
            </div>

            <app-badge variant="default" className="flex items-center gap-1">
              <span>{{ gratitude.mood | appMoodPipe }}</span>
              <span class="capitalize">{{ gratitude.mood }}</span>
            </app-badge>
          </div>

            @if (story) {
              <div>
                <app-button variant="outline" size="sm" [href]="'/s/story/' + story.id">
                  <lucide-icon [img]="HeartIcon" [size]="16"></lucide-icon>
                  <span class="pl-2">View Story</span>
                </app-button>
              </div>
            }
        </app-card-description>
      </app-card-header>

      <app-card-content>
        <div class="space-y-3">
          <h4 class="text-foreground">{{ gratitude.title }}</h4>
          <p class="text-muted-foreground leading-relaxed">
            {{ gratitude.description }}
          </p>
        </div>
      </app-card-content>

      <app-card-footer>
        @if (story) {
          <div class="mt-4 pt-4 border-t border-border">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <lucide-icon [img]="BookOpen" [size]="16"></lucide-icon>
              <span>
                    This entry contributed to the story "{{ story.title }}" with {{ story.entryCount }} other community entries
                  </span>
            </div>
          </div>
        }
      </app-card-footer>
    </app-card>
  `,
  imports: [BadgeComponent, ButtonComponent, CommonModule, ...Card, DateTimePipe, LucideAngularModule, MoodPipePipe]
})
export class DiaryCardComponent {
  @Input() gratitude!: Gratitude;
  @Input() story: Story | null | undefined;
  protected readonly CalendarIcon = CalendarIcon;
  protected readonly HeartIcon = HeartIcon;
  protected readonly BookOpen = BookOpen;
}
