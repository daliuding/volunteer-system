<template>
  <div class="service-query">
    <el-card>
      <h2>志愿服务历史总排名(所有年度总计)</h2>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item label="输入志愿者姓名">
          <el-input
              v-model="selectedVolunteer"
              placeholder="请输入姓名"
              style="width: 200px"
              @keyup.enter="handleSelectChange"
              clearable
              v-loading="loading"
              :disabled="loading"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 详细表格 -->
      <template v-if="detailData.detail.length > 0">
          <div class="total-points">
            积分总和：<strong>{{ detailData.total_points }}</strong>
            ,  姓名：<strong>{{ selectedVolunteer }}</strong>
          </div>
          <el-table 
            :data="detailData.detail"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column prop="name" label="姓名" width="150" />
            <el-table-column prop="mobile" label="电话" width="200" />
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
            <el-table-column prop="points" label="积分" width="100">
              <template #default="{row}">
                {{ row.points.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="服务内容" />
          </el-table>
      </template>

      <!-- 汇总表格 -->
      <template v-else>
        <el-row :gutter="20" >
          <el-col>
            <el-button type="primary" @click="exportExcel" size="large" >导出Excel</el-button>
          </el-col>
        </el-row>

        <el-table 
          :data="summaryData"
          border
          stripe
          style="width: 100%; margin-top: 20px;"
        >
          <el-table-column prop="name" label="姓名" width="150" />
          <el-table-column prop="mobile" label="电话" width="200" />
          <el-table-column label="总积分">
            <template #default="{row}">
              {{ row.total_points }}
            </template>
          </el-table-column>
        </el-table>

      </template>
    </el-card>
  </div>
</template>

  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import { utils, writeFile } from 'xlsx'

  // 数据状态
  const summaryData = ref([])
  const detailData = ref({ detail: [], total_points: 0 }) 
  const volunteerOptions = ref([])
  const selectedVolunteer = ref("")
  const loading = ref(false)
  const exportLoading = ref(false)

  // 加载初始数据
  const loadSummary = async () => {
    try {
      loading.value = true
      const response = await axios.get('http://localhost:3000/api/services/summary')
      summaryData.value = response.data
      volunteerOptions.value = response.data
    } catch (err) {
      ElMessage.error('加载积分汇总失败')
    } finally {
      loading.value = false
    }
  }

  // 加载详细数据
  const handleSelectChange = async() => {
    if (!selectedVolunteer.value) {
      detailData.value = { detail: [], total_points: 0 }
      return;
    }
    try {
      loading.value = true
      const response = await axios.get(`http://localhost:3000/api/services/detail/${selectedVolunteer.value}`)
      detailData.value = response.data
    } catch (err) {
      if (err.response.status === 404) {
        ElMessage.error('未找到匹配的志愿者')
      } else {
        ElMessage.error('加载服务记录失败')
      }
    } finally {
      loading.value = false
    }
  }

  watch(selectedVolunteer, (newValue) => {
    if (!newValue) {
      // 当输入框内容被清空时，重新加载全部数据
      detailData.value = { detail: [], total_points: 0 };
    }
   });

  // 日期格式化
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    // 2022-01-01T00:00:00.000Z 处理为 2022-01-01
    return new Date(dateStr).toLocaleDateString()
  }

  const exportExcel = () => {
    exportLoading.value = true
    try {
        // 准备数据
        const exportData = summaryData.value.map(item => ({
        '姓名': item.name,
        '电话': item.mobile,
        '总积分': item.total_points
        }))
        // 创建工作簿
        const worksheet = utils.json_to_sheet(exportData)
        const workbook = utils.book_new()
        utils.book_append_sheet(workbook, worksheet, "积分汇总")

        // 生成文件并下载
        writeFile(workbook, `志愿服务积分汇总_${new Date().toLocaleDateString()}.xlsx`, {
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