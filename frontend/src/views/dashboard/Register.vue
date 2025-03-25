<template>
    <el-card class="register-container">
      <h2>用户注册</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" 
        label-width="auto" label-position="left">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="registerForm.id_card" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="registerForm.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
          <el-button @click="resetForm">重置输入</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const registerForm = reactive({
    name: '',
    id_card: '',
    age: '',
    phone: ''
  })

  const rules = {
    name: [
      { required: true, message: '请输入真实姓名', trigger: 'blur' }
    ],
    id_card: [
      { required: true, message: '请输入身份证号', trigger: 'blur' }
    ],
    age: [
      { required: true, message: '请输入年龄', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话号码', trigger: 'blur' }
    ]
  }

  const submitForm = async () => {
    try {
      // 将用户信息提交到数据库
      const response = await axios.post('http://localhost:3000/api/register',
        {
          name: registerForm.name,
          id_card: registerForm.id_card,
          age: registerForm.age,
          phone: registerForm.phone
        }
      );

      if (response.data.success) {
        ElMessage.success('用户注册成功')
        router.push('/dashboard') // 跳转回后台首页
      } else {
        ElMessage.error('用户注册失败')
      }
    } catch (error) {
      console.log('服务器内部错误: error', error)
    }

  }

  const resetForm = () => {
    registerForm = {
      name: '',
      idCard: '',
      age: '',
      phone: ''
    }
  }

  </script>
  
  <style scoped>
  .register-container {
    width: 50%;
    margin: 0 auto;
  }
  </style>