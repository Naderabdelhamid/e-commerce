import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    // في الاغلب هنغير هنا البريريندر ل حاجه كلاينت كدا
  },
];

// ✅ دالة getPrerenderParams اللي بتجيب البيانات ديناميك من الـ API
export async function getPrerenderParams() {
  const res = await fetch('https://ecommerce.routemisr.com/api/v1/products');
  const data = await res.json();

  // الـ API بيرجع البيانات في data.data (حسب وثائق RouteMisr)
  const products = data.data;

  // رجّع مصفوفة من كل القيم اللي Angular هيبني بيها الصفحات
  return products.map((product: any) => ({
    slug: product.slug,
    id: product.id,
  }));
}
