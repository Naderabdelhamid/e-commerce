import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('velora_theme');
      if (savedTheme === 'dark') {
        this.enableDarkMode();
      } else if (savedTheme === 'light') {
        this.disableDarkMode();
      } else {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        if (prefersDark) {
          this.enableDarkMode();
        } else {
          this.disableDarkMode();
        }
      }
    }
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    this.isDarkMode.set(true);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('velora_theme', 'dark');
    }
  }

  private disableDarkMode(): void {
    this.isDarkMode.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('velora_theme', 'light');
    }
  }
}
