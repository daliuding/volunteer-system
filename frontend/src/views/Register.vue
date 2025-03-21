<template>
    <el-card class="register-container">
      <h2>用户注册</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        registerForm: {
          username: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value !== this.registerForm.password) {
                  callback(new Error('两次输入的密码不一致'));
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ]
        }
      };
    },
    methods: {
      handleRegister() {
        this.$refs.registerFormRef.validate((valid) => {
          if (valid) {
            this.$message.success('注册成功！');
            // 这里可以调用 API 提交注册数据
          } else {
            this.$message.error('请检查表单填写是否正确');
            return false;
          }
        });
      },
      resetForm() {
        this.$refs.registerFormRef.resetFields();
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
  }
  </style>