import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  getItem<T = string>(key: string): T | null {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return null;
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

