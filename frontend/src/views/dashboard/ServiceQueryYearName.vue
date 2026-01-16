<template>
  <el-card>
    <h2>服务详情查询</h2>
      <el-form :inline="true"  label-width="auto"  @submit.native.prevent size="large" >
          <el-form-item label="输入年份" style="width: 300px;">
            <el-select 
              v-model="selectedYear" 
              placeholder="请选择年份(可选)" 
              clearable
            >
              <el-option label="2026" value="2026" />
              <el-option label="2025" value="2025" />
              <el-option label="2024" value="2024" />
              <el-option label="2023" value="2023" />
              <el-option label="2022" value="2022" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" style="width: 300px;">
            <el-select 
              v-model="selectedDepartment" 
              placeholder="请选择部门(可选)" 
              clearable
            >
              <el-option label="数图中心" value="数图中心" />
              <el-option label="读者服务中心" value="读者服务中心" />
              <el-option label="少儿部" value="少儿部" />
              <el-option label="白云书院" value="白云书院" />
              <el-option label="总服务台" value="总服务台" />
            </el-select>
          </el-form-item>
          <el-form-item label="志愿者姓名" style="width: 300px;">
            <el-input
              v-model="selectedVolunteer"
              placeholder="请输入姓名(可选)"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleYearandVolunteerDetail">详情查询</el-button>
          </el-form-item>
      </el-form>

      <!-- 列出 selectedYear + selectedVolunteer年度的所有服务记录 -->
       <!-- 没有选择的，默认全部-->
      <template v-if="detailData.length > 0">
        <el-row :gutter="20" >
          <el-col>
            <el-button color="#626aef" @click="detailExportExcel" size="large" >导出Excel</el-button>
          </el-col>
        </el-row>
            
        <el-table :data="detailData" border stripe style="width: 100%; margin-top: 20px;">
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="department" label="所属部门" width="120" />
          <el-table-column prop="mobile" label="电话" width="150" />
          <el-table-column prop="service_date" label="服务日期" width="120">
            <template #default="{row}">
              {{ formatDate(row.service_date) }}
            </template>
          </el-table-column>
          <el-table-column label="服务时间" width="200">
            <template #default="{row}">
              {{ row.start_time }} - {{ row.end_time }}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="服务内容" width="200" />
          <el-table-column prop="points" label="积分">
            <template #default="{row}">
              {{ row.points.toFixed(1) }}
            </template>
          </el-table-column>

        </el-table>
      </template>
  
    </el-card>
  </template>
  
    <script setup>
    import { ref } from 'vue';
    import axios from 'axios'
    import { ElMessage } from 'element-plus'
    import { utils, write, writeFile } from 'xlsx'
    import {Search} from '@element-plus/icons-vue'
  
    // 数据状态
    const detailData = ref([])  // 年度详情
    const selectedYear = ref("")
    const selectedDepartment = ref("")
    const selectedVolunteer = ref("")
    const loading = ref(false)
    const exportLoading = ref(false)
  
    // 加载年度 详细的服务记录
    const handleYearandVolunteerDetail = async() => {
      // 允许任意组合查询，未选择的项默认为全部，所以不需要验证至少选择一个
      // 构建查询参数
      const params = {};
      if (selectedYear.value) params.year = selectedYear.value;
      if (selectedDepartment.value) params.department = selectedDepartment.value;
      if (selectedVolunteer.value) params.volunteer_name = selectedVolunteer.value;

      // 清空数据，重新加载
      detailData.value = []
      try {
        loading.value = true
        const response = await axios.get('http://localhost:3000/api/services/year-volunteer-detail', { params })
        detailData.value = response.data
        if (response.data.length === 0) {
          ElMessage.warning('没有找到相关服务记录')
        }
      } catch (err) {
        ElMessage.error('加载服务记录失败, 请稍后重试')
      } finally {
        loading.value = false
      }
    }
  

  
    // 日期格式化
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      // 2022-01-01T00:00:00.000Z 处理为 2022-01-01
      return new Date(dateStr).toLocaleDateString()
    }
  
    const detailExportExcel = () => {
      exportLoading.value = true
      try {
          // 准备数据
          const exportData = detailData.value.map(item => ({
          '姓名': item.name,
          '所属部门': item.department,
          '电话': item.mobile,
          '服务日期': formatDate(item.service_date),
          '服务时间': item.start_time + ' - ' + item.end_time,
          '服务内容': item.content,
          '积分': item.points.toFixed(1)
          }))
          // 创建工作簿
          const worksheet = utils.json_to_sheet(exportData)
          const workbook = utils.book_new()
          utils.book_append_sheet(workbook, worksheet, "志愿者年度积分详情")
  
          // 生成文件并下载
          let fileName = '服务详情';
          const parts = [];
          if (selectedYear.value) parts.push(`${selectedYear.value}年度`);
          if (selectedDepartment.value) parts.push(`${selectedDepartment.value}`);
          if (selectedVolunteer.value) parts.push(`志愿者${selectedVolunteer.value}`);
          if (parts.length > 0) {
            fileName = parts.join('_') + '_服务详情';
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
    </script>
  
    <style scoped>
    .service-query-year {
      padding: 20px;
    }
    .total-points {
      margin: 15px 0;
      font-size: 16px;
      color: #666;
    }
    :deep(.el-form-item__label) { /* 调整label 字号 */
      font-size: 16px;
    }
    </style>