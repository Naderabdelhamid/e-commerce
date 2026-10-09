import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type LangType = 'en' | 'ar';

export const TRANSLATIONS: Record<LangType, Record<string, string>> = {
  en: {
    // Brand
    brandName: 'Velora',
    brandTagline: 'PREMIUM STORE',

    // Navbar
    navHome: 'Home',
    navProducts: 'Products',
    navCategories: 'Categories',
    navBrands: 'Brands',
    navSearchPlaceholder: 'Search products...',
    navMyOrders: 'My Orders',
    navWishlist: 'My Wishlist',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started',
    navSignOut: 'Sign Out',
    navAccount: 'Account',
    navCustomer: 'Customer',

    // Home
    homeHeroBadge1: 'Special Offer',
    homeHeroTitle1: 'Fresh & Organic Groceries',
    homeHeroDesc1: 'Get up to 30% off on your first order. Hand-picked vegetables and fresh dairy.',
    homeHeroBadge2: 'Weekend Mega Sale',
    homeHeroTitle2: 'Daily Essentials Delivered',
    homeHeroDesc2: 'Premium household items, personal care, and healthy snacks delivered in minutes.',
    homeHeroBadge3: 'New Arrivals',
    homeHeroTitle3: 'Quality You Can Taste',
    homeHeroDesc3: 'Save big on premium bakery items, juices, and kitchen essentials today.',
    homeShopNow: 'Shop Now',
    homeExploreDeals: 'Explore Deals',
    homeOrderToday: 'Order Today',
    homeLimitedStock: 'Limited Stock',
    homeOrganicFruits: '100% Organic Fruits',
    homeBestPrice: 'Best Price',
    homeWeeklyDeals: 'Supermarket Weekly Deals',
    homeShopCollection: 'Shop Collection',
    homeDiscoverNow: 'Discover Now',

    // Perks
    perkFreeDelivery: 'Free Fast Delivery',
    perkFreeDeliveryDesc: 'On all orders over 500 EGP',
    perkSecurePay: 'Secure Payments',
    perkSecurePayDesc: '100% Protected transactions',
    perkSupport: '24/7 Live Support',
    perkSupportDesc: 'Always ready to assist you',
    perkReturns: 'Easy 14-Day Return',
    perkReturnsDesc: 'Hassle-free refund policy',

    // Headings
    homeShopCategories: 'Shop Popular Categories',
    homePopularProducts: 'Popular Products',
    homeExploreAll: 'Explore All Products',
    homeViewAllCategories: 'View All Categories',
    homeExploreDept: 'Explore Departments',
    homeHandpicked: 'Handpicked For You',

    // Product Card
    cardAddToCart: 'Add to Cart',
    cardAdding: 'Adding...',
    cardEgp: 'EGP',

    // Products Page
    prodCatalog: 'Complete Catalog',
    prodExploreTitle: 'Explore Our Products',
    prodShowing: 'Showing',
    prodMatching: 'items matching your criteria',
    prodResetFilters: 'Reset All Filters',
    prodSearchBtn: 'Search',
    prodSortDefault: 'Sort: Default',
    prodSortPriceLow: 'Price: Low to High',
    prodSortPriceHigh: 'Price: High to Low',
    prodSortRating: 'Top Rated',
    prodSortSelling: 'Best Selling',
    prodAllCategories: 'All Categories',
    prodAllBrands: 'All Brands',
    prodMinPrice: 'Min Price (EGP)',
    prodMaxPrice: 'Max Price (EGP)',
    prodNoFound: 'No products found',

    // Details Page
    detInStock: 'In Stock & Ready to Ship',
    detAboutItem: 'About this item',
    detSimilarProducts: 'Similar Products You Might Like',
    detFastDelivery: 'Fast Express Delivery',
    detGenuine: '100% Genuine Guaranteed',
    detReturnWindow: '14 Days Return Window',
    detEncrypted: 'Secure Encrypted Payment',

    // Cart Page
    cartMyBag: 'My Bag',
    cartTitle: 'Shopping Cart',
    cartClearAll: 'Clear All Items',
    cartEmptyTitle: 'Your cart is empty',
    cartEmptyDesc: 'Explore our wide selection of fresh items and add your favorites to the cart!',
    cartStartShopping: 'Start Shopping',
    cartUnitPrice: 'Unit Price',
    cartOrderSummary: 'Order Summary',
    cartCouponCode: 'Coupon Code',
    cartApply: 'Apply',
    cartSubtotal: 'Subtotal',
    cartDiscount: 'Promo Discount',
    cartDelivery: 'Delivery',
    cartFree: 'Free',
    cartTotal: 'Total Amount',
    cartProceedCheckout: 'Proceed to Checkout',

    // Checkout Page
    checkoutFinalStep: 'Final Step',
    checkoutTitle: 'Checkout',
    checkoutSubtitle: 'Provide your delivery address and choose your payment method',
    checkoutSavedAddr: 'Quick Pick: Saved Addresses',
    checkoutShippingInfo: 'Shipping Information',
    checkoutCity: 'City / Governorate',
    checkoutAddressDetails: 'Detailed Address / Street',
    checkoutPhone: 'Contact Phone Number',
    checkoutPaymentOption: 'Payment Option',
    checkoutCashOnDeliv: 'Cash on Delivery',
    checkoutCashDesc: 'Pay with cash upon package receipt.',
    checkoutCardPay: 'Credit / Debit Card',
    checkoutCardDesc: 'Secure payment via Visa / Mastercard / Stripe.',
    checkoutConfirmCash: 'Confirm Cash Order',
    checkoutProceedCard: 'Proceed to Card Payment',

    // Orders Page
    ordersHistory: 'Order History',
    ordersTitle: 'My Past Orders',
    ordersSubtitle: 'Review your recent purchases, delivery status, and invoice summaries',
    ordersEmptyTitle: 'No orders placed yet',
    ordersEmptyDesc: "You haven't placed any orders yet. Discover our fresh catalog and start shopping!",
    ordersDelivered: 'Delivered',
    ordersProcessing: 'Processing',
    ordersPaidOnline: 'Paid Online',
    ordersCashOnDeliv: 'Cash On Delivery',
    ordersTotalAmount: 'Total Amount',
    ordersQuantity: 'Quantity',

    // Brands Page
    brandsPartners: 'Official Partners',
    brandsTitle: 'Top Featured Brands',
    brandsSubtitle: "Explore authentic items from the world's leading brands",
    brandsFilterPlaceholder: 'Filter brands...',
    brandsViewCollection: 'View Collection',
    brandsExploreItems: 'Explore Items',

    // Categories Page
    catCurated: 'Curated Collections',
    catTitle: 'Explore Categories',
    catSubtitle: 'Browse through our vast catalog organized by categories and departments',
    catViewSubcategories: 'View Subcategories',
    catBrowseAll: 'Browse All Products',

    // Footer
    footerAppBadge: 'Velora Experience',
    footerAppTitle: 'Get the Velora Mobile App',
    footerAppDesc: 'Experience lightning fast checkout, exclusive mobile-only discounts, and real-time order tracking.',
    footerShareLink: 'Share App Link',
    footerAboutDesc: 'Velora is your trusted destination for groceries, electronics, and lifestyle products. Fresh goods delivered with care directly to your doorstep.',
    footerPaymentPartners: 'Payment Partners:',
    footerGetApp: 'Get App:',
    footerCopyright: '© 2026 Velora Market. All rights reserved. Designed with precision & excellence.',
  },

  ar: {
    // Brand
    brandName: 'فيلورا',
    brandTagline: 'متجر فاخر',

    // Navbar
    navHome: 'الرئيسية',
    navProducts: 'المنتجات',
    navCategories: 'الأقسام',
    navBrands: 'الماركات',
    navSearchPlaceholder: 'ابحث عن أي منتج...',
    navMyOrders: 'طلباتي السابقة',
    navWishlist: 'قائمة رغباتي',
    navSignIn: 'تسجيل الدخول',
    navGetStarted: 'إنشاء حساب',
    navSignOut: 'تسجيل الخروج',
    navAccount: 'حسابي',
    navCustomer: 'عميل',

    // Home
    homeHeroBadge1: 'عرض حصري',
    homeHeroTitle1: 'منتجات طازجة وعضوية',
    homeHeroDesc1: 'احصل على خصم يصل إلى 30% على طلبك الأول. خضروات ومنتجات ألبان طازجة يومياً.',
    homeHeroBadge2: 'تخفيضات نهاية الأسبوع',
    homeHeroTitle2: 'احتياجاتك اليومية حتى باب بيتك',
    homeHeroDesc2: 'أفضل المستلزمات المنزلية، العناية الشخصية، ووجبات صحية تصلك في دقائق.',
    homeHeroBadge3: 'وصل حديثاً',
    homeHeroTitle3: 'جودة استثنائية تستحقها',
    homeHeroDesc3: 'وفر أكثر مع تشكيلة المخبوزات الفاخرة والعصائر ومستلزمات المطبخ الحديث.',
    homeShopNow: 'تسوق الآن',
    homeExploreDeals: 'اكتشف العروض',
    homeOrderToday: 'اطلب اليوم',
    homeLimitedStock: 'كمية محدودة',
    homeOrganicFruits: 'فواكه عضوية 100%',
    homeBestPrice: 'أفضل سعر',
    homeWeeklyDeals: 'عروض السوبرماركت الأسبوعية',
    homeShopCollection: 'تصفح المجموعة',
    homeDiscoverNow: 'اكتشف الآن',

    // Perks
    perkFreeDelivery: 'شحن مجاني وسريع',
    perkFreeDeliveryDesc: 'لكافة الطلبات فوق 500 جنيه',
    perkSecurePay: 'دفع إلكتروني آمن',
    perkSecurePayDesc: 'معاملات مشفرة ومحمية 100%',
    perkSupport: 'دعم فني متواصل 24/7',
    perkSupportDesc: 'فريقنا جاهز لمساعدتك دائماً',
    perkReturns: 'إرجاع سهل خلال 14 يوم',
    perkReturnsDesc: 'استرجاع فوري بدون أي تعقيدات',

    // Headings
    homeShopCategories: 'تسوق حسب الأقسام الشائعة',
    homePopularProducts: 'المنتجات الأكثر طلباً',
    homeExploreAll: 'تصفح جميع المنتجات',
    homeViewAllCategories: 'عرض جميع الأقسام',
    homeExploreDept: 'أقسام المتجر',
    homeHandpicked: 'مختارة بعناية لأجلك',

    // Product Card
    cardAddToCart: 'أضف للسلة',
    cardAdding: 'جاري الإضافة...',
    cardEgp: 'ج.م',

    // Products Page
    prodCatalog: 'الكتالوج الشامل',
    prodExploreTitle: 'استكشف منتجاتنا',
    prodShowing: 'عرض',
    prodMatching: 'منتج يطابق اختيارك',
    prodResetFilters: 'إعادة ضبط الفلاتر',
    prodSearchBtn: 'بحث',
    prodSortDefault: 'الترتيب: الافتراضي',
    prodSortPriceLow: 'السعر: من الأقل للأعلى',
    prodSortPriceHigh: 'السعر: من الأعلى للأقل',
    prodSortRating: 'الأعلى تقييماً',
    prodSortSelling: 'الأكثر مبيعاً',
    prodAllCategories: 'جميع الأقسام',
    prodAllBrands: 'جميع الماركات',
    prodMinPrice: 'أقل سعر (ج.م)',
    prodMaxPrice: 'أعلى سعر (ج.م)',
    prodNoFound: 'لم يتم العثور على منتجات',

    // Details Page
    detInStock: 'متوفر في المخزون وجاهز للشحن',
    detAboutItem: 'تفاصيل ومواصفات المنتج',
    detSimilarProducts: 'منتجات مشابهة قد تنال إعجابك',
    detFastDelivery: 'توصيل سريع ومضمون',
    detGenuine: 'منتج أصلي 100% ومضمون',
    detReturnWindow: 'فترة إرجاع مجانية 14 يوماً',
    detEncrypted: 'دفع مشفر وآمن بالكامل',

    // Cart Page
    cartMyBag: 'حقيبة التسوق',
    cartTitle: 'سلة المشتريات',
    cartClearAll: 'إفراغ السلة بالكامل',
    cartEmptyTitle: 'سلة المشتريات فارغة حالياً',
    cartEmptyDesc: 'تصفح تشكيلة منتجاتنا المتنوعة وأضف ما تحتاجه إلى سلتك!',
    cartStartShopping: 'ابدأ التسوق الآن',
    cartUnitPrice: 'سعر الوحدة',
    cartOrderSummary: 'ملخص الفاتورة',
    cartCouponCode: 'كود الخصم',
    cartApply: 'تطبيق',
    cartSubtotal: 'المجموع الفرعي',
    cartDiscount: 'خصم الكوبون',
    cartDelivery: 'الشحن والتوصيل',
    cartFree: 'مجاني',
    cartTotal: 'الإجمالي للدفع',
    cartProceedCheckout: 'المتابعة لإنهاء الطلب',

    // Checkout Page
    checkoutFinalStep: 'الخطوة الأخيرة',
    checkoutTitle: 'إتمام الطلب والدفع',
    checkoutSubtitle: 'أدخل عنوان التوصيل واختر طريقة الدفع المناسبة لك',
    checkoutSavedAddr: 'عناوينك المحفوظة مسبقاً',
    checkoutShippingInfo: 'بيانات عنوان الشحن',
    checkoutCity: 'المدينة / المحافظة',
    checkoutAddressDetails: 'العنوان التفصيلي / الشارع ورقم المبنى',
    checkoutPhone: 'رقم هاتف التواصل',
    checkoutPaymentOption: 'طريقة الدفع المفضلة',
    checkoutCashOnDeliv: 'الدفع نقداً عند الاستلام',
    checkoutCashDesc: 'ادفع نقداً عند استلام شحنتك حتى باب بيتك.',
    checkoutCardPay: 'الدفع بالبطاقة البنكية',
    checkoutCardDesc: 'دفع فوري وآمن عبر فيزا / ماستركارد / سترايب.',
    checkoutConfirmCash: 'تأكيد الطلب والدفع عند الاستلام',
    checkoutProceedCard: 'المتابعة للدفع الإلكتروني',

    // Orders Page
    ordersHistory: 'سجل الطلبات',
    ordersTitle: 'طلباتي وفواتيري السابقة',
    ordersSubtitle: 'تابع حالة الشحنات، تفاصيل المشتريات، وتواريخ الطلب',
    ordersEmptyTitle: 'لا توجد طلبات سابقة بعد',
    ordersEmptyDesc: 'لم تقم بإجراء أي طلبات حتى الآن. اكتشف منتجاتنا وابدأ التسوق!',
    ordersDelivered: 'تم التوصيل بنجاح',
    ordersProcessing: 'جاري التجهيز والشحن',
    ordersPaidOnline: 'مدفوع إلكترونياً',
    ordersCashOnDeliv: 'الدفع عند الاستلام',
    ordersTotalAmount: 'المبلغ الإجمالي',
    ordersQuantity: 'الكمية',

    // Brands Page
    brandsPartners: 'شركاؤنا الرسميون',
    brandsTitle: 'أشهر الماركات العالمية',
    brandsSubtitle: 'تسوق من كبرى العلامات التجارية الموثوقة والأصلية',
    brandsFilterPlaceholder: 'تصفية الماركات...',
    brandsViewCollection: 'عرض المنتجات',
    brandsExploreItems: 'تصفح المجموعة',

    // Categories Page
    catCurated: 'تشكيلات مختارة',
    catTitle: 'أقسام المتجر',
    catSubtitle: 'تصفح كتالوجنا الشامل مقسماً حسب الأقسام والتصنيفات',
    catViewSubcategories: 'عرض الأقسام الفرعية',
    catBrowseAll: 'تصفح منتجات هذا القسم',

    // Footer
    footerAppBadge: 'تجربة فيلورا',
    footerAppTitle: 'حمل تطبيق فيلورا للهواتف',
    footerAppDesc: 'تمتع بتجربة تسوق سريعة، خصومات حصرية لمستخدمي التطبيق، وتتبع فوري لطلباتك.',
    footerShareLink: 'أرسل رابط التطبيق',
    footerAboutDesc: 'فيلورا هو متجرك الموثوق لشراء الأطعمة الطازجة، الإلكترونيات، ومستلزمات الحياة اليومية بجودة عالمية وتوصيل حتى باب بيتك.',
    footerPaymentPartners: 'شركاء الدفع المعتمدون:',
    footerGetApp: 'حمل التطبيق:',
    footerCopyright: '© 2026 متجر فيلورا. جميع الحقوق محفوظة. صُمم بأعلى معايير الإتقان والجودة.',
  },
};

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly currentLang = signal<LangType>('en');
  readonly isRtl = computed(() => this.currentLang() === 'ar');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = (localStorage.getItem('velora_lang') as LangType) || 'en';
      this.setLanguage(savedLang);
    }
  }

  setLanguage(lang: LangType): void {
    this.currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('velora_lang', lang);
      const isRtl = lang === 'ar';
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
      if (isRtl) {
        document.body.classList.add('font-arabic');
      } else {
        document.body.classList.remove('font-arabic');
      }
    }
  }

  toggleLanguage(): void {
    const nextLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  }

  translate(key: string): string {
    const lang = this.currentLang();
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  }
}
