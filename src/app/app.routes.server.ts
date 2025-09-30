import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    // في الاغلب هنغير هنا البريريندر ل حاجه كلاينت كدا
  },
];
