import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  if (cookieService.get('token')) {
    return true; // home , cart , products
  } else {
    return router.parseUrl('/login');

    // navigate to login
    // router.navigate(['/login']);
    // return false; // login , register
  }
};
