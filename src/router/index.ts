import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserInfoViewVue from '../views/UserInfoView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
          path: '/userinfo',
          name: 'userinfo',
          component: UserInfoViewVue
      },
    ]
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
