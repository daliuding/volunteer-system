<template>
  <el-container>
    <el-aside width="300px">
      <h4 class="mb-2">志愿者管理</h4>
      <el-menu
        :default-active= "$route.path === '/dashboard'? '/service-register' : $route.path"
        class="el-menu-vertical-demo"
        router
        @select="handleMenuSelect"
      >
      <el-sub-menu index="/user">
        <template #title>
          <el-icon size="large"><User /></el-icon>
          <span style="font-size: 18px;">用户管理</span>
        </template>
          <el-menu-item index="/register">用户注册</el-menu-item>
          <el-menu-item index="/query">用户查询</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="/service">
        <template #title>
          <el-icon size="large"><IconMenu /></el-icon>
          <span style="font-size: 17.5px;">志愿服务管理</span>
        </template>
          <el-menu-item index="/service-registery">服务登记</el-menu-item>
          <el-menu-item index="/service-query-year">服务详情查询</el-menu-item>
          <el-menu-item index="/service-query-acc">年度汇总查询</el-menu-item>
          <el-menu-item index="/service-query">历史总排名</el-menu-item>
      </el-sub-menu>
      </el-menu>   
    </el-aside>

    <!-- 主内容区 -->
    <el-container id="main">
      <el-header>
        <span>大连市图书馆志愿者服务管理</span>
        <div class="login-status">
          <span>当前登录: {{ loggedInUser }}</span>
          <el-button @click="logout" >退出登录</el-button>
        </div>
      </el-header>
      <div class="main-container flex">
        <div>
          <RouterView />
        </div>
      </div>
    </el-container>

  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Menu as IconMenu  } from '@element-plus/icons-vue';

const router = useRouter()

// 菜单选择处理
const handleMenuSelect = (index) => {
  router.push(index)
};

const loggedInUser = localStorage.getItem('username')

const logout = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style scoped>
.el-container {
  height: 93vh;
}

.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
  font-size: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.el-menu-item {
  font-size: 16.5px;
}

.main-container {
  padding: 40px;
}

.login-status {
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 10px;
}

</style>
