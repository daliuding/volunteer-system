<template>
  <el-container>
    <el-aside width="300px">
      <h4 class="mb-2">志愿者管理</h4>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        router
        @select="handleMenuSelect"
      >
      <el-sub-menu index="user-management">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="/register">用户注册</el-menu-item>
          <el-menu-item index="/query">用户查询</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <el-menu-item index="/checkin">
        <el-icon><IconMenu /></el-icon>
        <span>志愿服务签到</span>
      </el-menu-item>
      </el-menu>   
    </el-aside>

    <!-- 主内容区 -->
    <el-container id="main">
      <el-header>大连图书馆管理系统</el-header>
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
}

.main-container {
  padding: 40px;
}

</style>
