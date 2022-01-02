import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/graph/index'
  },
  {
    path: '/graph/index',
    component: () => import('@/views/GraphView.vue')
  },
  {
    path: '/graph/index/:rowid',
    component: () => import('@/views/GraphView.vue')
  },
  {
    path: '/graph/db',
    component: () => import('@/views/DbView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
