<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header class="header">智慧矿山管理系统</el-header>
      <el-container>
        <!-- <div style="width: 20px;height: 20px;"><el-icon><ArrowRightBold /></el-icon></div> -->
        <!-- 左边菜单栏开始-->
        <el-aside class="left_menu" style="width: var(--el-aside-width,)">

          <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
            @close="handleClose">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <User />
                </el-icon>
                <span>系统管理</span>
              </template>
              <el-menu-item-group>

                <router-link to="/userinfo"><el-menu-item index="/userinfo">员工管理</el-menu-item></router-link>
                <router-link to="/DeptView"><el-menu-item index="/DeptView">部门管理</el-menu-item></router-link>
                <el-menu-item index="1-3">岗位管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Notebook />
                </el-icon>
                <span>日志管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">登录日志</el-menu-item>
                <el-menu-item index="2-2">操作日志</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>

            <router-link to="/equipment">
              <el-menu-item index="/equipment">
                <el-icon>
                  <Van />
                </el-icon>
                <template #title>设备管理</template>
              </el-menu-item>
            </router-link>
            
            <el-menu-item index="4">
              <el-icon>
                <WindPower />
              </el-icon>
              <template #title>环境监测</template>
            </el-menu-item>

            <el-menu-item index="5">
              <el-icon>
                <setting />
              </el-icon>
              <template #title>生产信息</template>
            </el-menu-item>

            <el-menu-item index="6">
              <el-icon>
                <Files />
              </el-icon>
              <template #title>固有信息</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-radio-group v-model="isCollapse" style="margin-bottom: 15px;display: block;">
          <el-radio-button :label="false"><el-icon>
              <ArrowRightBold />
            </el-icon></el-radio-button>
          <el-radio-button :label="true"><el-icon>
              <ArrowLeftBold />
            </el-icon></el-radio-button>
        </el-radio-group>
        <!-- 左边菜单栏 结束-->

        <!-- 右边 -->
        <el-main class="right_main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>



  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Notebook,
  Files,
  WindPower,
  User,
  Van,
  ArrowLeftBold,
  Setting,
  ArrowRightBold,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}


</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.common-layout {
  display: block;
  width: 100%;
}

.header {
  display: block;
  width: 100%;
  text-align: center;
  align-items: center;
  line-height: 60px;
  font-weight: 900;
  font-size: 2em;
  background-color: rgb(1 17 70);
}</style>
