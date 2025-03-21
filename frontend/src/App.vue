<script setup>


</script>

<template>
  <el-container>
    <!-- style="background: url('/public/library-frontend.jpg') no-repeat;
      background-size: cover; height: 100vh; width: 100vw;" -->
      <el-header>大连图书馆志愿服务系统</el-header>
      <el-main>
      <router-view/> 
      </el-main>
  </el-container>
</template>

<style>
.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
  font-size: 36px;
}
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
 }
</style>
