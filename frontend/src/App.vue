<script setup>


</script>

<template>
  <el-container>
    <!-- style="background: url('/public/library-frontend.jpg') no-repeat;
      background-size: cover; height: 100vh; width: 100vw;" -->
      <el-main>
      <router-view/> 
      </el-main>
  </el-container>
</template>

<style>
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
 }
</style>
