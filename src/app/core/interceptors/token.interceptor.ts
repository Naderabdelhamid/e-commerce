import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('token');

  // If token exists and request does not already have a token header, attach it
  if (token && !req.headers.has('token')) {
    const clonedReq = req.clone({
      setHeaders: {
        token: token,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
