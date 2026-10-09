import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
        <div class="h-[3px] w-full bg-emerald-500/20 overflow-hidden">
          <div class="loading-bar-progress h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-bar-progress {
      width: 100%;
      animation: loadingAnim 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      transform-origin: 0% 50%;
    }

    @keyframes loadingAnim {
      0% {
        transform: translateX(-100%) scaleX(0.2);
      }
      50% {
        transform: translateX(0%) scaleX(0.8);
      }
      100% {
        transform: translateX(100%) scaleX(0.2);
      }
    }
  `]
})
export class LoadingBarComponent {
  readonly loadingService = inject(LoadingService);
}
