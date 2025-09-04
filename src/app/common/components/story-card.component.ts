import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from './card.component';
import {Story} from '../models/story.model';
import {DateTimePipe} from '../pipes/date-time.pipe';
import {BadgeComponent} from './badge.component';

@Component({
  selector: 'app-story-card',
  standalone: true,
  template: `
    <app-card className="w-[698px] max-w-full">
      <app-card-header>
        <div class="flex items-start justify-between w-full">
          <div class="space-y-1">
            <app-card-title className="text-xl leading-tight">
              {{ story.title }}
            </app-card-title>
            <app-card-description>
              {{ story.date | appDateTime }}
            </app-card-description>
          </div>
          <app-badge variant="default" className="flex items-center space-x-1">
            <span>{{ story.entryCount }}</span>
            <span class="text-xs">entries</span>
          </app-badge>
        </div>
      </app-card-header>
      <app-card-content>
        <div class="prose prose-sm max-w-none">
          <p class="text-foreground leading-relaxed">
            {{ story.content }}
          </p>
        </div>
      </app-card-content>
    </app-card>
  `,
  imports: [BadgeComponent, CommonModule, ...Card, DateTimePipe]
})
export class StoryCardComponent {
  @Input() story!: Story;
}
