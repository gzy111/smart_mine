import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserInfoViewVue from '../views/UserInfoView.vue'
import EquipmentView from '../views/EquipmentView.vue'
import DeptView from '../views/DeptView.vue'
import infoView from '../views/infoView.vue'

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
      {
        path: '/equipment',
        name: 'equipment',
        component: EquipmentView,
      },
    
      {
        path: '/DeptView',
        name: 'DeptView',
        component: DeptView
    },
    {
      path: '/infoView',
      name: 'infoView',
      component: infoView
  },
    ]
  },


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
