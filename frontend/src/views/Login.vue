<template>
  <el-container class="login-container">
    <el-main>
      <el-card class="login-card"><h2>管理员登录</h2>
        <el-form :model="form" label-width="80px">
          <el-form-item label="用户名" size="large">
            <el-input v-model="form.username" size="large"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="form.password" size="large" label="密码"/>
          </el-form-item>
          <el-button type="primary" size="large" @click="handleLogin">登录</el-button>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'

  const form = reactive({ username: '', password: '' })
  const router = useRouter()


  const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', form)
    if (response.data.success) {
      ElMessage.success('登录成功')
      // router.push('/dashboard') // TODO: 跳转到后台首页
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (err) {
    ElMessage.error('登录失败!!')
  }
}
  

</script>

  <style scoped>
  .login-container {
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  }
 

  .login-card {
    width: 400px;
  }
  </style>
