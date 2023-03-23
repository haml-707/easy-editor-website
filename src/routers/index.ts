import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
} from 'vue-router';
import { useLangStore } from '@/stores';
import { getUserAuth, isLogined } from '@/shared/login';
import { getUrlParam } from '@/shared/utils';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/' },
  {
    path: '/zh/',
    name: 'home',
    alias: '/en/',
    component: () => import('@/views/TheEdit.vue'),
  },
  {
    path: '/zh/login',
    name: 'login',
    alias: '/en/login',
    component: () => import('@/views/login/TheLogin.vue'),
  },
  {
    path: '/zh/edit/:path/:name',
    name: 'edit',
    alias: '/en/edit/:path/:name',
    component: () => import('@/views/sig/TheSig.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('/en/') ? 'en' : 'zh';

  if (getUserAuth().token) {
    if (to.fullPath.includes('login')) {
      console.log(666);
      next({
        path: getUrlParam('redirect') || '/',
      });
    } else {
      next();
    }
  } else {
    console.log(777);
    if (to.fullPath.includes('login')) {
      next();
    } else {
      console.log(777);
      next({
        path: `/zh/login`,
        query: { redirect: to.fullPath },
      });
    }
  }

  // await isLogined()
  //   .then(() => {})
  //   .catch(() => {

  //   });
});
