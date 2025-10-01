import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductComponent } from './features/product/product.component';
import { BrandsComponent } from './features/brands/brands.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { DetailsComponent } from './features/details/details.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { NotfoundDetailsComponent } from './features/notfound.details/notfound.details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login Page' },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register Page',
      },
    ],
  },

  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, title: 'Home Page' },
      { path: 'cart', component: CartComponent, title: 'Cart Page' },
      { path: 'products', component: ProductComponent, title: 'Products Page' },
      { path: 'brands', component: BrandsComponent, title: 'Brands Page' },
      {
        path: 'categories',
        component: CategoriesComponent,
        title: 'Categories Page',
      },

      // ✅ Route اللي فيه dynamic params
      {
        path: 'details/:slug/:id',
        component: DetailsComponent,
        title: 'Details Page',
      },

      {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'Checkout Page',
      },
    ],
  },

  { path: '**', component: NotfoundDetailsComponent, title: 'EROR page 404' },
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
