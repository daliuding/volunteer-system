<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <!-- 基本信息 -->
    <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="姓名" prop="real_name" required>
            <el-input v-model="form.real_name" maxlength="6" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio value="男">男</el-radio>
              <el-radio value="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item label="民族" prop="ethnicity">
                <el-input v-model="form.ethnicity" />
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="出生日期" prop="birth_date">
                <el-date-picker v-model="form.birth_date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
            </el-form-item>
        </el-col>
    </el-row>

    <!-- 证件信息 -->
    <el-col :span="10">
        <el-form-item label="身份证号" prop="id_card">
            <el-input v-model="form.id_card" maxlength="18" />
        </el-form-item>
    </el-col>

    <!-- 地址信息 -->
    <el-row :gutter="10">
        <el-col :span="5">
            <el-form-item label="籍贯" prop="native_place">
                <el-input v-model="form.native_place" maxlength="8"  />
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item label="户籍地" prop="domicile">
                <el-input v-model="form.domicile" maxlength="8" />
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="联系地址" prop="address" >
                <el-input v-model="form.address" maxlength="30" show-word-limit />
            </el-form-item>
        </el-col>
    </el-row>

    <!-- 学历面貌 -->
    <el-row :gutter="10">
        <el-col :span="5">
            <el-form-item label="学历" prop="education">
                <el-select v-model="form.education">
                    <el-option label="初中及以下" value="初中及以下"></el-option>
                    <el-option label="高中" value="高中"></el-option>
                    <el-option label="大专" value="大专"></el-option>
                    <el-option label="本科" value="本科"></el-option>
                    <el-option label="研究生及以上" value="研究生及以上"></el-option>
                </el-select>
            </el-form-item>
        </el-col>

        <el-col :span="5">
            <el-form-item label="政治面貌" prop="political_status">
                <el-select v-model="form.political_status">
                    <el-option label="中共党员" value="党员"></el-option>
                    <el-option label="共青团员" value="共青团员"></el-option>
                    <el-option label="群众" value="群众"></el-option>
                    <el-option label="其他" value="其他"></el-option>
                </el-select>
            </el-form-item>
        </el-col>

        <el-col :span="5">
            <el-form-item label="健康状况" prop="health_status">
                <el-input v-model="form.health_status" maxlength="10" />
            </el-form-item>
        </el-col>
    </el-row>

      <!-- 联系方式-->
      <el-row :gutter="10">
        <el-col :span="5">
            <el-form-item label="手机号码" prop="mobile" required>
                <el-input v-model="form.mobile" maxlength="11" />
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item label="微信号" prop="wechat">
                <el-input v-model="form.wechat" maxlength="20" />
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item label="QQ号" prop="qq">
                <el-input v-model="form.qq" maxlength="20" />
            </el-form-item>
        </el-col>
      </el-row>
  
      <!-- 特长选择 -->
      <el-form-item label="个人特长" prop="specialties">
        <el-checkbox-group v-model="form.specialties">
          <el-checkbox
            v-for="item in specialties"
            :key="item"
            :value="item"
            >{{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 服务经历动态表单 -->
      <el-form-item 
        v-for="(exp, index) in form.experiences"
        :key="index"
        :label="`经历${index + 1}`"
      >
        <el-row :gutter="1">
          <el-col :span="4">
            <el-date-picker
              v-model="exp.start_date"
              type="date"
              placeholder="开始日期"
            />
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="exp.end_date"
              type="date"
              placeholder="结束日期"
            />
          </el-col>
          <el-col :span="6">
            <el-input v-model="exp.organization" placeholder="实践/工作单位名称" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="exp.position" placeholder="岗位" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="exp.description" placeholder="主要工作内容" />
          </el-col>
          <el-col :span="4">
            <el-button @click="removeExperience(index)">删除</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-button @click="addExperience" type="info">添加经历</el-button>

      <!-- 胜任原因 -->
      <el-form-item label="胜任原因" prop="qualification">
        <el-input v-model="form.qualification" maxlength="100" style="width: 600px" :rows="2" type="textarea" show-word-limit />
      </el-form-item>
      <!-- 服从分配保证 -->
      <el-form-item label="是否服从分配" prop="guarantee">
        <el-switch
          v-model="form.guarantee"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit" size="large">提交注册</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios';
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const form = reactive({
    real_name: '',
    gender: '',
    id_card: '',
    ethnicity: '',
    birth_date: '',
    native_place: '',
    domicile: '',
    address: '',
    education: '',
    health_status: '',
    political_status: '',
    mobile: '',
    wechat: '',
    qq: '',
    specialties: [],
    experiences: [{
      start_date: '',
      end_date: '',
      organization: '',
      position: '',
      description: ''
    }],
    qualification: '',
    guarantee: true
  })

  const specialties = ref([
    '教学辅导', '医疗护理', '心理咨询',
    '外语翻译', '摄影设计', 'IT技术',
    '组织协调', '体力劳动', '其他'
  ])

  // 只强制填写 姓名、手机号码
  const rules = {
    real_name: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 6, message: '姓名长度在2到6个字符', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { min: 11, max: 11, message: '手机号码长度为11个字符', trigger: 'blur' }
    ]
  }

  const addExperience = () => {
    form.experiences.push({
      start_date: '',
      end_date: '',
      organization: '',
      position: '',
      description: ''
    })
  }

  const removeExperience = (index) => {
    form.experiences.splice(index, 1)
  }

  // 个人特长和胜任原因的数据经过 JSON 格式化后，提交到后端
  const submit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        ...form,
        experiences: JSON.stringify(form.experiences),
        specialties: JSON.stringify(form.specialties)
      })
      if (response.data.success) {
        ElMessage.success('注册成功')
        router.push('/dashboard') // 跳转回后台首页
      } else {
        ElMessage.error('用户注册失败')
      }
    } catch (err) {
      ElMessage.error('服务器内部错误: ' + (err.response?.data?.error || '未知错误'))
    } finally {
      // 重置表单
      form.real_name = ''
    }
  }
  </script>