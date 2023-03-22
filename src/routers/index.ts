import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';

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
    alias: '/zh/edit/:path/:name',
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

router.beforeEach((to) => {
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('/en/') ? 'en' : 'zh';
  // const loginStore = useLoginStore();

  // 如已登录，直接进入
  // if (loginStore.isLogined) {
  //   return true;
  // }
});
