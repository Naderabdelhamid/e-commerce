import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <button
        (click)="scrollToTop()"
        type="button"
        aria-label="Scroll back to top"
        class="fixed bottom-6 end-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-700/30 dark:shadow-emerald-950/60 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 group animate-fade-in"
      >
        <i class="fas fa-arrow-up text-sm transition-transform duration-300 group-hover:-translate-y-0.5"></i>
      </button>
    }
  `,
  styles: [`
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.7) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .animate-fade-in {
      animation: fadeInScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class BackToTopComponent {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isVisible = signal<boolean>(false);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
      this.isVisible.set(scrollPosition > 300);
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
