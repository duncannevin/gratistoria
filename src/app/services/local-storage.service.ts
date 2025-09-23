import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  getItem<T = string>(key: string): T | null {
    const v = localStorage.getItem(key);
    if (v == null) return null;
    try {
      return JSON.parse(v) as T;
    } catch {
      // Return raw string when value is not JSON
      return v as unknown as T;
    }
  }

  setItem<T = unknown>(key: string, value: T): void {
    try {
      const v = typeof value === 'string' ? (value as unknown as string) : JSON.stringify(value);
      localStorage.setItem(key, v);
    } catch {
      // ignore
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
