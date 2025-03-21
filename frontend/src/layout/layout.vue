<template>
  <el-container class="layout-container">
    <!-- 侧边导航栏 -->
    <el-aside width="200px">
      <el-menu
        :default-active="$route.path"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><PieChart /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/volunteers">
          <el-icon><User /></el-icon>
          <span>志愿者管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header>大连图书馆管理系统</el-header>
      <div class="main-container flex">
      <BaseSide />
      <div w="full" py="4">
        <RouterView />
      </div>
    </div>

    </el-container>
  </el-container>
</template>

<script setup>
import { PieChart, User } from '@element-plus/icons-vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
}
</style>