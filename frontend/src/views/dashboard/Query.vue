<template>
    <div class="query-volunteer">
        <el-card class="box-card">
            <h2>志愿者查询</h2>
            <el-form :inline="true" class="query-form">
                <el-form-item label="所属部门">
                    <el-select
                        v-model="selectedDepartment"
                        placeholder="选择部门（可选）"
                        style="width: 200px"
                        clearable
                    >
                        <el-option label="数图中心" value="数图中心"></el-option>
                        <el-option label="读者服务中心" value="读者服务中心"></el-option>
                        <el-option label="少儿部" value="少儿部"></el-option>
                        <el-option label="白云书院" value="白云书院"></el-option>
                        <el-option label="总服务台" value="总服务台"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input
                        v-model="selectedName"
                        placeholder="请输入姓名（可选）"
                        style="width: 200px"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
            
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="department" label="所属部门"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="wechat" label="微信"></el-table-column>
                <el-table-column prop="political_status" label="政治面貌"></el-table-column>
                <el-table-column prop="education" label="学历"></el-table-column>
                <el-table-column prop="specialties" label="特长"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const tableData = ref([]);
const selectedName = ref("");
const selectedDepartment = ref("");
const loading = ref(false);

// 默认加载所有志愿者
const fetchAllVolunteers = async () => {
    loading.value = true;
    try {
        const response = await axios.get("http://localhost:3000/api/volunteers");
        if (response.data.success) {
            tableData.value = response.data.data;
        } else {
            ElMessage.error("加载志愿者数据失败");
        }
    } catch (error) {
        ElMessage.error("加载志愿者数据失败");
    } finally {
        loading.value = false;
    }
};

// 查询处理：根据部门和/或姓名查询
const handleQuery = async () => {
    loading.value = true;
    try {
        const params = new URLSearchParams();
        if (selectedDepartment.value) {
            params.append("department", selectedDepartment.value);
        }
        if (selectedName.value) {
            params.append("name", selectedName.value);
        }

        const queryString = params.toString();
        const url = queryString
            ? `http://localhost:3000/api/volunteers/query?${queryString}`
            : "http://localhost:3000/api/volunteers";

        const response = await axios.get(url);
        if (response.data.success) {
            tableData.value = response.data.data;
        } else {
            ElMessage.error("未找到匹配的志愿者");
            tableData.value = [];
        }
    } catch (error) {
        ElMessage.error("查询失败");
    } finally {
        loading.value = false;
    }
};

// 重置查询条件并重新加载所有数据
const handleReset = () => {
    selectedDepartment.value = "";
    selectedName.value = "";
    fetchAllVolunteers();
};

onMounted(() => {
    fetchAllVolunteers();
});
</script>

<style scoped>
.query-volunteer {
    padding: 20px;
}
.query-form {
    margin-bottom: 20px;
}
</style>