<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import {useUserStore} from '@/stores'
import { userUpdateService } from '@/api/user'
const {user:{email,id,nickname,username},getUser} = useUserStore()
const formModel = ref({
  id,
  username, 
  nickname,
  email
});
const rules = ref({
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度必须在 2 到 10 位之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
})
const formRef = ref()
const submitForm = async () => {
    await formRef.value.validate()
    await userUpdateService(formModel.value)
    // 通知用户修改数据
    getUser()
}
</script>
<template>
    <!-- 这里的回显可以使用pinia -->
    <PageContainer title="基本资料">
        <!-- 表单部分 -->
        <template #default>
            <!-- 绑定一个ref，为了检验是否正确 -->
            <el-form :model="formModel" :rules="rules" ref="formRef" label-width="120px">
                <el-form-item label="登录名称" prop="username">
                <el-input v-model="formModel.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="formModel.nickname"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="formModel.email"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="submitForm">提交修改</el-button>
                </el-form-item>
            </el-form>
        </template>
    </PageContainer>
</template>