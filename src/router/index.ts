import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserInfoViewVue from '../views/UserInfoView.vue'
import EquipmentView from '../views/EquipmentView.vue'
import DeptView from '../views/DeptView.vue'
import infoView from '../views/infoView.vue'
import PostView from '../views/PostView.vue'
import RepairView from '../views/RepairView.vue'
import productionInfoView from '../views/productionInfoView.vue'
import testVue from '../views/test.vue'
import measureView from '../views/measureView.vue'
import login from '../views/login.vue'


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
    {
      path: '/PostView',
      name: 'PostView',
      component: PostView
    },
    {
      path: '/RepairView',
      name: 'RepairView',
      component: RepairView
    },
    {
      path: '/productionInfoView',
      name: 'productionInfoView',
      component: productionInfoView
    },
    {
      path: '/measureView',
      name: 'measureView',
      component: measureView
    },
    {
      path: '/testVue',
      name: 'testVue',
      component: testVue
    }

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
