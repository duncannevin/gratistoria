import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import moment from 'moment';
import { BehaviorSubject, catchError, map, Observable, of, take, tap } from 'rxjs';
import { Gratitude } from '@models/gratitude.model';

@Injectable({
  providedIn: 'root'
})
export class GratitudeService {
  private apiUrl = `${environment.apiUrl}`;
  private unauthorizedEntry = '';
  private diaryPaginationKey = '';

  private diaryEntries = new BehaviorSubject<any[]>([]);
  diaryEntries$ = this.diaryEntries.asObservable();
  private moreDiaryEntries = new BehaviorSubject(false);
  moreDiaryEntries$ = this.moreDiaryEntries.asObservable();

  constructor(private readonly http: HttpClient) {
  }

  setUnauthorizedEntry(entry: string) {
    this.unauthorizedEntry = entry;
  }

  saveUnauthorizedEntry() {
    if (this.unauthorizedEntry) {
      return this.createGratitude({ entry: this.unauthorizedEntry });
    }
    return of(null);
  }

  createGratitude(gratitude: { entry: string }) {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.http.post(`${this.apiUrl}/daily`, {
      entry: gratitude.entry,
      datetime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  setDiary(): void {
    this.http.get<{items: any[], key: string}>(`${this.apiUrl}/diary`)
      .pipe(
        tap(response => {
          this.diaryPaginationKey = response.key || '';
          this.diaryEntries.next(response.items || []);
          this.moreDiaryEntries.next(this.diaryPaginationKey.length > 0);
        }),
        map(response => response.items || []),
        take(1),
      ).subscribe();
  }

  setMoreDiaryEntries(): void {
    if (!this.moreDiaryEntries) {
      return;
    }

    this.http.get<{items: any[], key: string}>(`${this.apiUrl}/diary?paginationToken=${this.diaryPaginationKey}`)
      .pipe(
        tap(response => {
          this.diaryPaginationKey = response.key || '';
          this.diaryEntries.next([...this.diaryEntries.value, ...response.items]);
          this.moreDiaryEntries.next(this.diaryPaginationKey.length > 0)
        }),
        map(response => response.items || []),
        take(1),
      ).subscribe();
  }

  // --- New public API used by NgRx effects ---------------------------------

  /**
   * Load a page of diary entries. If `paginationToken` is provided, fetches the next page.
   * Returns mapped items and the next token (or null when no more pages).
   */
  getPage(paginationToken?: string): Observable<{ items: Gratitude[]; nextToken: string | null }> {
    const url = paginationToken
      ? `${this.apiUrl}/diary?paginationToken=${encodeURIComponent(paginationToken)}`
      : `${this.apiUrl}/diary`;

    return this.http
      .get<{ items?: any[]; key?: string }>(url)
      .pipe(
        map((res) => ({
          items: (res.items ?? []).map((it) => this.toModel(it)),
          nextToken: res.key ?? null,
        })),
      );
  }

  /** Back-compat helper: returns only items for first page. */
  getAll(): Observable<Gratitude[]> {
    return this.getPage().pipe(map((r) => r.items));
  }

  /** Create today's gratitude entry. Returns created model or null. */
  create(entry: string): Observable<Gratitude | null> {
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const payload = {
      entry,
      datetime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    } as const;

    return this.http
      .post<any>(`${this.apiUrl}/daily`, payload)
      .pipe(
        map((res) => this.maybeModel(res)),
        catchError((_err: HttpErrorResponse) => of(null)),
      );
  }

  /** Load today's entry if it exists; returns null for 404/empty. */
  getToday(): Observable<Gratitude | null> {
    const today = moment().format('YYYY-MM-DD');
    return this.http
      .get<any>(`${this.apiUrl}/today?datetime=${today}`)
      .pipe(
        map((res) => this.maybeModel(res)),
        catchError((_err: HttpErrorResponse) => of(null)),
      );
  }

  // --- Mapping helpers -----------------------------------------------------

  private maybeModel(res: any): Gratitude | null {
    try {
      return this.toModel(res);
    } catch {
      return null;
    }
  }

  /** Best-effort mapping from API object to Gratitude model. */
  private toModel(obj: any): Gratitude {
    // Map strictly to the expected API shape with some fallbacks
    const id: string = String(obj.id ?? obj.entryId ?? '');
    const systemTimestamp: string = String(obj.systemTimestamp ?? obj.system_time ?? obj.createdAt ?? '');
    const clientTimezone: string = String(obj.clientTimezone ?? obj.timezone ?? '');
    const userId: string = String(obj.userId ?? obj.ownerId ?? '');
    const entry: string = String(obj.entry ?? obj.text ?? '');
    const timestamp: string = String(obj.timestamp ?? obj.datetime ?? obj.date ?? '');

    if (!id || !entry) {
      throw new Error('Invalid gratitude shape');
    }

    return { id, systemTimestamp, clientTimezone, userId, entry, timestamp };
  }
}
