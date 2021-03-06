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
    path: '/graph/col-score-list',
    component: () => import('@/views/ColScoreList.vue')
  },
  {
    path: '/graph/db-col-score-list',
    component: () => import('@/views/DBColScoreList.vue')
  },
  {
    path: '/graph/db-user',
    component: () => import('@/views/DBUserGraphView.vue')
  },
  {
    path: '/graph/db-manage',
    component: () => import('@/views/ManageDBView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
