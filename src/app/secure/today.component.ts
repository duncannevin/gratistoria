import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card, ButtonComponent, InputComponent, PulseCardComponent} from '@components';
import {DateTimePipe} from '@pipes/date-time.pipe';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {DiaryActions, TodayActions, selectDiaryCreating, selectToday, selectTodayError, selectTodayLoading} from '@state';
import moment from 'moment';

@Component({
  standalone: true,
  template: `
    <div class="flex flex-col">
      <div class="inline-block text-center p-6 rounded-lg w-[698px] max-w-full m-auto">
        <h2 class="text-2xl mb-2">Today's Gratitude ✨</h2>
      </div>
    <!-- Existing entry state -->
    @if (value()) {
      <app-card>
        <app-card-header>
          <app-card-description>
            <div class="text-center">
              Your gratitude has been beautifully captured for today. Tomorrow, it will become part of our community story.
            </div>
          </app-card-description>
        </app-card-header>
        <app-card-content className="space-y-4">
          <div class="space-y-2 text-center">
            <div class="text-sm text-muted-foreground">{{ value()!.timestamp | appDateTime }}</div>
            <p class="text-foreground leading-relaxed whitespace-pre-line">{{ value()!.entry }}</p>
          </div>

          <div class="text-center text-sm text-muted-foreground">
            See you tomorrow for another moment of gratitude
          </div>
        </app-card-content>
      </app-card>
    } @else if (loading()) {
      <app-pulse-card></app-pulse-card>
    } @else {
      <app-card>
        <app-card-header className="text-center">
          <app-card-description>
            <div class="text-center">
              {{ today | appDateTime: 'dddd, MMMM D, YYYY' }} • Take a moment to reflect on something you're grateful
              for today
            </div>
          </app-card-description>
        </app-card-header>
        <app-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-2">
              <app-input
                formControlName="title"
                id="title"
                name="title"
                [required]="true"
                placeholder="A simple moment, person, or experience..."
                label="What are you grateful for?"
              ></app-input>
            </div>

            <div class="space-y-2">
              <label for="description" class="block text-sm font-medium text-foreground">Tell us more about it</label>
              <textarea
                id="description"
                formControlName="description"
                required
                placeholder="Describe why this matters to you, how it made you feel, or what it taught you..."
                class="min-h-32 leading-relaxed flex w-full rounded-md border-none bg-input px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ></textarea>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-medium text-foreground">How does this make you feel?</label>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button
                  *ngFor="let option of moodOptions"
                  type="button"
                  (click)="selectMood(option.value)"
                  [ngClass]="
                      'p-3 rounded-lg border-2 transition-all text-center ' +
                      (form.get('mood')?.value === option.value
                        ? option.color + ' border-current'
                        : 'border-border hover:border-muted-foreground/50')
                    "
                >
                  <div class="text-2xl mb-1">{{ option.emoji }}</div>
                  <div class="text-sm">{{ option.label }}</div>
                </button>
              </div>
            </div>

            <app-card-footer>
              <app-button variant="default" size="md" type="submit" [full]="true"
                          [disabled]="loading() || form.invalid">
                {{ loading() ? 'Saving your gratitude...' : 'Share your gratitude' }}
              </app-button>
            </app-card-footer>
          </form>
        </app-card-content>
      </app-card>
    }
    </div>
  `,
  imports: [...Card, CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, DateTimePipe, PulseCardComponent],
})
export class TodayComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  readonly today = moment().toDate();

  private todaySel = toSignal(this.store.select(selectToday), { initialValue: null });
  private loadingTodaySel = toSignal(this.store.select(selectTodayLoading), { initialValue: true });
  private creatingSel = toSignal(this.store.select(selectDiaryCreating), { initialValue: false });
  private errorTodaySel = toSignal(this.store.select(selectTodayError), { initialValue: null });

  readonly value = computed(() => this.todaySel());
  readonly loading = computed(() => this.loadingTodaySel() || this.creatingSel());
  readonly error = computed(() => this.errorTodaySel());

  readonly moodOptions = [
    {value: 'joyful', label: 'Joyful', emoji: '😊', color: 'bg-yellow-100 text-yellow-800'},
    {value: 'peaceful', label: 'Peaceful', emoji: '🕊️', color: 'bg-blue-100 text-blue-800'},
    {value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'bg-emerald-100 text-emerald-800'},
    {value: 'hopeful', label: 'Hopeful', emoji: '🌱', color: 'bg-lime-100 text-lime-800'},
    {value: 'reflective', label: 'Reflective', emoji: '✨', color: 'bg-purple-100 text-purple-800'},
  ];

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      mood: ['', Validators.required],
    });
    this.store.dispatch(TodayActions.load());
  }

  get selectedMood() {
    const v = this.form.get('mood')?.value;
    return this.moodOptions.find((m) => m.value === v) || null;
  }

  selectMood(value: string) {
    this.form.get('mood')?.setValue(value);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { title, description, mood } = this.form.value as { title: string; description: string; mood: string };
    const entry = `${title}\n\n${description}`.trim();
    this.store.dispatch(DiaryActions.create({ entry }));
  }
}
