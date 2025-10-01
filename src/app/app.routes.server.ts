import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'details/:slug/:id',
    renderMode: RenderMode.Client, // 👈 كده هيبطل يدور على getPrerenderParams
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    // في الاغلب هنغير هنا البريريندر ل حاجه كلاينت كدا
  },
];
