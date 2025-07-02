<template>
  <el-card>
    <h2>服务详情查询</h2>
      <el-form :inline="true"  label-width="auto"  @submit.native.prevent size="large" >
          <el-form-item label="输入年份" style="width: 250px;">
            <el-select 
              v-model="selectedYear" 
              placeholder="请选择年份" 
              clearable
            >
              <el-option label="2025" value="2025" />
              <el-option label="2024" value="2024" />
              <el-option label="2023" value="2023" />
              <el-option label="2022" value="2022" />
            </el-select>
          </el-form-item>
          <el-form-item label="志愿者姓名" style="width: 250px;">
            <el-input
              v-model="selectedVolunteer"
              placeholder="请输入姓名"
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
    import { ref, watch } from 'vue';
    import axios from 'axios'
    import { ElMessage } from 'element-plus'
    import { utils, write, writeFile } from 'xlsx'
    import {Search} from '@element-plus/icons-vue'
  
    // 数据状态
    const detailData = ref([])  // 年度详情
    const selectedYear = ref("")
    const selectedVolunteer = ref("")
    const loading = ref(false)
    const exportLoading = ref(false)
  
    // 加载年度 详细的服务记录
    const handleYearandVolunteerDetail = async() => {
      if (!selectedYear.value && !selectedVolunteer.value) {
        ElMessage.warning('请选择年份或输入志愿者姓名')
        return;
      }
      // 构建查询参数
      const params = {};
      if (selectedYear.value) params.year = selectedYear.value;
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
  
    watch(selectedYear, (newValue) => {
      if (!newValue) {
        // 当输入框内容被清空时，重新加载全部数据
        detailData.value = [];
      }
     })

  
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
          if (selectedYear.value === "") {
            writeFile(workbook, `志愿者${selectedVolunteer.value}服务详情_${new Date().toLocaleDateString()}.xlsx`, {
              compression: true
            })
          } else if (selectedVolunteer.value === "") {
            writeFile(workbook, `${selectedYear.value}年度所有志愿者服务详情_${new Date().toLocaleDateString()}.xlsx`, {
              compression: true
            })
          } else {
            writeFile(workbook, `${selectedYear.value}年度志愿者${selectedVolunteer.value}服务详情_${new Date().toLocaleDateString()}.xlsx`, {
              compression: true
            })
          }

  
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