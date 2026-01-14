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
              @change="handleVolunteerChange"
            >
              <el-option
                v-for="volunteer in volunteerList"
                :key="volunteer.id"
                :label="volunteer.real_name"
                :value="volunteer.real_name"
              />
            </el-select>
          </el-form-item>
          
          <!-- 所属部门 -->
          <el-form-item label="所属部门" prop="department">
            <!-- 如果只有一个部门，使用只读输入框锁定 -->
            <el-input 
              v-if="availableDepartments.length === 1"
              v-model="form.department"
              placeholder="选择志愿者后自动填充"
              readonly
              style="width: 100%"
            />
            <!-- 如果有多个部门，提供下拉选择 -->
            <el-select 
              v-else-if="availableDepartments.length > 1"
              v-model="form.department"
              placeholder="请选择所属部门"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dept in availableDepartments"
                :key="dept"
                :label="dept"
                :value="dept"
              />
            </el-select>
            <!-- 如果还没有选择志愿者，显示提示 -->
            <el-input 
              v-else
              v-model="form.department"
              placeholder="请先选择志愿者姓名"
              readonly
              disabled
              style="width: 100%"
            />
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
  
  // 当前选中志愿者姓名对应的可用部门列表
  const availableDepartments = ref([])
  
  // 表单数据
  const form = reactive({
    volunteer_name: '',
    department: '',
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
    department: [
      { required: true, message: '请选择所属部门', trigger: 'change' }
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

  // 当选择志愿者时，获取该姓名对应的所有部门
  const handleVolunteerChange = (volunteerName) => {
    if (volunteerName) {
      // 查找所有同名志愿者，获取他们的部门列表
      const sameNameVolunteers = volunteerList.value.filter(v => v.real_name === volunteerName)
      const departments = [...new Set(sameNameVolunteers.map(v => v.department).filter(Boolean))]
      
      availableDepartments.value = departments
      
      // 如果只有一个部门，自动填充并锁定
      if (departments.length === 1) {
        form.department = departments[0]
      } else if (departments.length > 1) {
        // 如果有多个部门，清空当前选择，让用户手动选择
        form.department = ''
      } else {
        form.department = ''
        ElMessage.warning('该志愿者未设置部门信息')
      }
    } else {
      // 如果清空志愿者选择，也清空部门和可用部门列表
      form.department = ''
      availableDepartments.value = []
    }
  }

  onMounted(() => {
    loadVolunteers()
});
  
  // 提交表单
  const submitForm = async () => {
    try {
      // 先进行表单验证
      if (!formRef.value) return
      await formRef.value.validate()
      
      submitting.value = true

      // 验证志愿者姓名和部门是否匹配
      if (!form.volunteer_name || !form.department) {
        ElMessage.error('请选择志愿者和所属部门')
        submitting.value = false
        return
      }

      // 根据姓名和部门查找对应的志愿者（解决重名问题）
      const volunteer = volunteerList.value.find(
        v => v.real_name === form.volunteer_name && v.department === form.department
      )
      
      if (!volunteer) {
        ElMessage.error(`未找到姓名为"${form.volunteer_name}"且部门为"${form.department}"的志愿者，请检查选择是否正确`)
        submitting.value = false
        return
      }

      if (!form.start_time || !form.end_time) {
        ElMessage.error('请选择服务时间段')
        submitting.value = false
        return
      }
      
      // 使用找到的 volunteer_id 提交记录
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
        // 重置可用部门列表
        availableDepartments.value = []
      }
    } catch (err) {
      if (err.response?.data?.error) {
        ElMessage.error(err.response.data.error)
      } else if (err.message && err.message.includes('validate')) {
        // 表单验证失败，不显示错误消息（Element Plus 会自动显示）
      } else {
        ElMessage.error('提交失败，请检查网络')
      }
    } finally {
      submitting.value = false
    }
  }
  
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