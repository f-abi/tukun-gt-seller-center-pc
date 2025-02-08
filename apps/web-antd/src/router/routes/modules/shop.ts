import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:shopping-bag',
      keepAlive: true,
      order: 10,
      title: $t('shop.title'),
    },
    name: 'Shop',
    path: '/shop',
    children: [
      {
        meta: {
          title: $t('shop.product.management'),
        },
        name: 'ProductManagement',
        path: '/shop/product-management',
        component: () => import('#/views/shop/product-management/index.vue'),
      },
    ],
  },
];

export default routes;
