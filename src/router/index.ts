import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");
import NotFound from '../views/error-page/404.vue';
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true, },
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: "Dashboard",
    meta: { title: '首页', icon: "House" },
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: '' }
    }]
  },
  // {
  //   path: '/:catchAll(.*)',
  //   component: NotFound
  // },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
