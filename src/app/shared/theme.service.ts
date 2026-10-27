import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'bdi-theme';

/**
 * Presentation-only theme switch. Writes data-bs-theme on <html> and remembers an
 * explicit user choice in localStorage; without a saved choice it follows the system.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSubject = new BehaviorSubject<Theme>('light');
  readonly theme$ = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.apply(this.resolveInitialTheme());

    const media = this.matchSystemDark();
    media?.addEventListener?.('change', event => {
      if (!this.readSaved()) {
        this.apply(event.matches ? 'dark' : 'light');
      }
    });
  }

  get current(): Theme {
    return this.themeSubject.value;
  }

  toggle(): void {
    this.set(this.current === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage can be unavailable (private mode); the theme still applies for this session
    }
    this.apply(theme);
  }

  private apply(theme: Theme): void {
    this.document.documentElement.setAttribute('data-bs-theme', theme);
    this.themeSubject.next(theme);
  }

  private resolveInitialTheme(): Theme {
    return this.readSaved() ?? (this.matchSystemDark()?.matches ? 'dark' : 'light');
  }

  private readSaved(): Theme | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch {
      return null;
    }
  }

  private matchSystemDark(): MediaQueryList | null {
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)') ?? null;
  }
}
