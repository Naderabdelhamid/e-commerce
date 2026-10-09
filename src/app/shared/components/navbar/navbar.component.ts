import { AuthService } from './../../../core/auth/services/auth.service';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { TranslationService } from '../../../core/services/translation/translation.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @Input({ required: true }) isLogin!: boolean;

  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  readonly transService = inject(TranslationService);

  readonly wishlistCount = this.wishlistService.wishlistCount;
  readonly cartCount = this.cartService.cartCount;
  readonly currentUser = this.authService.currentUser;
  readonly isDarkMode = this.themeService.isDarkMode;
  readonly currentLang = this.transService.currentLang;

  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isProfileMenuOpen = signal<boolean>(false);
  searchQuery = '';

  ngOnInit(): void {
    if (this.isLogin && this.cookieService.get('token')) {
      this.authService.syncUser();
      this.cartService.getLoggesUserCart().subscribe();
      this.wishlistService.getWishlist().subscribe();
    }
  }

  t(key: string): string {
    return this.transService.translate(key);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.transService.toggleLanguage();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update((open) => !open);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    if (q) {
      this.router.navigate(['/products'], {
        queryParams: { keyword: q },
      });
    } else {
      this.router.navigate(['/products'], {
        queryParams: {},
      });
    }
    this.closeMobileMenu();
  }

  signOut(): void {
    this.cartService.clear();
    this.wishlistService.clear();
    this.authService.logOut();
    this.closeProfileMenu();
    this.closeMobileMenu();
  }
}
