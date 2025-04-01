<template>
    <div class="service-register">
      <el-card class="register-card">
        <h2>志愿服务登记</h2>
        <el-form 
          :model="form" 
          :rules="rules" 
          ref="formRef"
          label-width="120px"
        >
          <!-- 志愿者选择 -->
          <el-form-item label="志愿者姓名" prop="volunteer_name">
            <el-select 
              v-model="form.volunteer_name"
              placeholder="请选择志愿者"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="volunteer in volunteerList"
                :key="volunteer.id"
                :label="volunteer.real_name"
                :value="volunteer.real_name"
              />
            </el-select>
          </el-form-item>
  
          <!-- 服务日期 -->
          <el-form-item label="服务日期" prop="service_date">
            <el-date-picker
              v-model="form.service_date"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
  
          <!-- 服务时间 -->
          <el-form-item label="服务时间段" required>
            <div class="time-range">
              <el-form-item prop="start_time" style="display: inline-block;">
                <el-time-picker
                  v-model="form.start_time"
                  placeholder="开始时间"
                  format="HH:mm"
                  value-format="HH:mm"
                />
              </el-form-item>
              <span class="time-separator">至</span>
              <el-form-item prop="end_time" style="display: inline-block;">
                <el-time-picker
                  v-model="form.end_time"
                  placeholder="结束时间"
                  format="HH:mm"
                  value-format="HH:mm"
                />
              </el-form-item>
            </div>
          </el-form-item>
  
          <!-- 服务内容 -->
          <el-form-item label="服务内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="服务内容描述, 至少输入1个字符"
            />
          </el-form-item>
  
          <!-- 提交按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              @click="submitForm"
              :loading="submitting"
            >
              提交登记
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const formRef = ref(null)
  const submitting = ref(false)  // 避免中后台尚未完成提交逻辑时，重复提交
  const volunteerList = ref([])
  
  // 表单数据
  const form = reactive({
    volunteer_name: '',
    service_date: '',
    start_time: '',
    end_time: '',
    content: ''
  })
  
  // 验证规则
  const rules = {
    volunteer_name: [
      { required: true, message: '请输入志愿者姓名', trigger: 'blur' }
      ],
    service_date: [
      { required: true, message: '请选择服务日期', trigger: 'blur' }
    ],
    start_time: [
      { required: true, message: '请选择开始时间', trigger: 'blur' },
    ],
    end_time: [
      { required: true, message: '请选择结束时间', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (form.start_time && value <= form.start_time) {
            callback(new Error('结束时间必须晚于开始时间'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    content: [
      { required: true, message: '请输入服务内容', trigger: 'blur' },
      { min: 1, message: '至少输入1个字符', trigger: 'blur' }
    ]
  }
  
  // 加载所有志愿者列表
  const loadVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/volunteers")
        if (response.data.success) {
            volunteerList.value = response.data.data
        } 
    } catch (err) {
      ElMessage.error('加载志愿者列表失败')
    }
  }

  onMounted(() => {
    loadVolunteers()
});
  
  // 提交表单
  const submitForm = async () => {
    try {
      submitting.value = true

      // 根据volunteer.name获取volunteer_id
      const volunteer = volunteerList.value.find(v => v.real_name === form.volunteer_name)
      if (!volunteer) {
        ElMessage.error('请选择志愿者')
        return
      }
      if (!form.start_time || !form.end_time) {
        ElMessage.error('请选择服务时间段')
        return
      }
      // 不需要发送name数据，后端直接用id来插入记录
      const response = await axios.post('http://localhost:3000/api/service-registery', {
        volunteer_id: volunteer.id,
        service_date: form.service_date,
        start_time: form.start_time,
        end_time: form.end_time,
        content: form.content
      })
  
      if (response.data.success) {
        ElMessage.success('服务记录已保存')
        formRef.value.resetFields()
      }
    } catch (err) {
      if (err.response?.data?.error) {
        ElMessage.error(err.response.data.error)
      } else {
        ElMessage.error('提交失败，请检查网络')
      }
    } finally {
      submitting.value = false
    }
  }
  
  onMounted(() => {
    loadVolunteers()
  })
  </script>
  
  <style scoped>
  .service-register {
    padding: 20px;
  }
  .register-card {
    max-width: 800px;
    margin: 0 auto;
  }
  .time-range {
    display: flex;
    align-items: center;
  }
  .time-separator {
    margin: 0 10px;
    color: var(--el-text-color-secondary);
  }
  </style>