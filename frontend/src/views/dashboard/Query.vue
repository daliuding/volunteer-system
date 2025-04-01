<template>
    <div class="query-volunteer">
        <el-card class="box-card">
            <h2>志愿者查询</h2>
            <el-form :inline="true" class="query-form">
                <el-form-item label="姓名">
                    <el-select 
                        v-model="selectedName"
                        placeholder="请选择姓名" 
                        @change="fetchSingle" 
                        style="width: 200px"
                        clearable
                        v-loading="loading"
                        :disabled="loading"
                    >
                        <el-option
                            v-for="volunteer in volunteerList"
                            :key="volunteer.id"
                            :label="volunteer?.real_name || ''"
                            :value="volunteer?.real_name || ''"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table v-if="volunteerData" :data="volunteerData" style="width: 100%">
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="wechat" label="微信"></el-table-column>
                <el-table-column prop="political_status" label="政治面貌"></el-table-column>
                <el-table-column prop="education" label="学历"></el-table-column>
                <el-table-column prop="specialties" label="特长" ></el-table-column>
            </el-table>
            <el-table v-else :data="volunteerList? volunteerList :[]" style="width: 100%">
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="wechat" label="微信"></el-table-column>
                <el-table-column prop="education" label="学历"></el-table-column>
                <el-table-column prop="political_status" label="政治面貌"></el-table-column>
                <el-table-column prop="specialties" label="特长"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const volunteerList = ref([]);
const selectedName = ref("");
const volunteerData = ref(null);
const loading = ref(true);


const fetchVolunteers = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/volunteers")
        if (response.data.success) {
            volunteerList.value = response.data.data
        }
        loading.value = false
    } catch (error) {
        ElMessage.error("加载志愿者数据失败")
    } finally {
        loading.value = false
    }
};

const fetchSingle = async () => {
    if (!selectedName.value) {
        volunteerData.value = null
        return;
    }
    try {       
        const response = await axios.get(`http://localhost:3000/api/volunteer/${selectedName.value}`);
        if (response.data.success) {
            volunteerData.value = response.data.data
            if (!volunteerData.value) {
                ElMessage.warning('未找到该志愿者信息')
            }
        } else {
            ElMessage.error('查询失败')
        }
    } catch (error) {
        ElMessage.error("Failed to search volunteer")
    }
};

onMounted(() => {
    fetchVolunteers()
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