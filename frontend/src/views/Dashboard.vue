<template>
  <el-container>
    <el-aside width="300px">
      <h4 class="mb-2">志愿者管理</h4>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="1-1">用户注册</el-menu-item>
          <el-menu-item index="1-2">用户查询</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <span>志愿服务签到</span>
      </el-menu-item>
      </el-menu>   
    </el-aside>

          <!-- 主内容区 -->
          <el-container>
        <el-header>大连图书馆管理系统</el-header>
        <div class="main-container flex">
        <div w="full" py="4">
          xxx
          <RouterView />
        </div>
        </div>
      </el-container>

  </el-container>
</template>

<script setup>

</script>

<style scoped>
.el-header {
background-color: #409EFF;
color: white;
line-height: 60px;
font-size: 34px;
}

</style>
