<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref} from 'vue'
import { userUpdatePassService} from '@/api/user'
import {useUserStore} from '@/stores'
import {useRouter} from 'vue-router'
const router = useRouter()
const formRef = ref()
// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 校验规则
// 原密码和新密码不一样
// 新密码和确认密码一样
// cb是一个回调函数，用于执行具体的验证逻辑
const checkOldSame = (rule, value, cb) => {
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}

const checkNewSame = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}
// validator 是一个自定义验证函数，用于执行具体的验证逻辑
const rules = ref({
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
     {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
});
const onReset = () => {
    // 清楚表单验证信息
    formRef.value.clearValidate()
    pwdForm.value = {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
    }
}
const userStore = useUserStore()
const onSubmit = async () => {
    // 先校验
   await formRef.value.validate()
   await userUpdatePassService(pwdForm.value)
   ElMessage.success('密码修改成功')
    //密码修改成功后，退出重新登录，清空token
    userStore.setToken('')
    userStore.setUser({})
    router.push('/login')
}
</script>

<template>
    <PageContainer title="重置密码">
        <!-- 修改宽度 -->
        <el-row>
            <el-col :span="12">
                <el-form :model="pwdForm" :rules="rules" ref="formRef" label-width="120px">
                    <el-form-item label="原密码" prop="old_pwd">
                    <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                    <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="re_pwd">
                    <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="onSubmit">修改密码</el-button>
                    <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>   
        </el-row>
    </PageContainer>
</template>