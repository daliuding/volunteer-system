<template>
  <div class="service-query">
    <el-card>
      <h2>志愿服务历史总排名(所有年度总计)</h2>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item label="选择部门">
          <el-select
              v-model="selectedDepartment"
              placeholder="请选择部门"
              style="width: 250px"
              clearable
              @change="handleDepartmentChange"
              v-loading="loading"
              :disabled="loading"
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 汇总表格 -->
      <el-row :gutter="20" >
        <el-col>
          <el-button type="primary" @click="exportExcel" size="large" :loading="exportLoading">导出Excel</el-button>
        </el-col>
      </el-row>

      <el-table 
        :data="summaryData"
        border
        stripe
        style="width: 100%; margin-top: 20px;"
        v-loading="loading"
      >
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column prop="department" label="部门" width="150" />
        <el-table-column prop="mobile" label="电话" width="200" />
        <el-table-column label="总积分">
          <template #default="{row}">
            {{ row.total_points }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import { utils, writeFile } from 'xlsx'

  // 数据状态
  const summaryData = ref([])
  const departmentOptions = ref([])
  const selectedDepartment = ref("")
  const loading = ref(false)
  const exportLoading = ref(false)

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/departments')
      departmentOptions.value = response.data
    } catch (err) {
      ElMessage.error('加载部门列表失败')
    }
  }

  // 加载积分汇总数据
  const loadSummary = async () => {
    try {
      loading.value = true
      const params = {}
      if (selectedDepartment.value) {
        params.department = selectedDepartment.value
      }
      const response = await axios.get('http://localhost:3000/api/services/summary', { params })
      summaryData.value = response.data
    } catch (err) {
      ElMessage.error('加载积分汇总失败')
    } finally {
      loading.value = false
    }
  }

  // 部门选择变化时重新加载数据
  const handleDepartmentChange = () => {
    loadSummary()
  }

  const exportExcel = () => {
    exportLoading.value = true
    try {
        // 准备数据
        const exportData = summaryData.value.map(item => ({
        '姓名': item.name,
        '部门': item.department || '',
        '电话': item.mobile,
        '总积分': item.total_points
        }))
        // 创建工作簿
        const worksheet = utils.json_to_sheet(exportData)
        const workbook = utils.book_new()
        utils.book_append_sheet(workbook, worksheet, "积分汇总")

        // 生成文件并下载
        let fileName = '志愿服务积分汇总'
        if (selectedDepartment.value) {
          fileName = `${selectedDepartment.value}_${fileName}`
        }
        writeFile(workbook, `${fileName}_${new Date().toLocaleDateString()}.xlsx`, {
        compression: true
        })

        ElMessage.success('导出成功')
    } catch (err) {
        ElMessage.error('导出失败: ' + err.message)
    } finally {
        exportLoading.value = false
    }
  }

  onMounted(() => {
    loadDepartments()
    loadSummary()
  })
  </script>

  <style scoped>
  .service-query {
    padding: 20px;
  }
  .total-points {
    margin: 15px 0;
    font-size: 16px;
    color: #666;
  }
  </style>