import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/' },
  // zh
  {
    path: '/zh/',
    name: 'zh',
    alias: '/en/',
    component: () => import('@/views/summit/TheSummit.vue'),
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
  langStore.lang = to.fullPath.includes('en') ? 'en' : 'zh';
});
