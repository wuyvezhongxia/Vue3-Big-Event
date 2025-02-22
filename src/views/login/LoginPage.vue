<script setup>
import { userLoginService, userRegisterService } from '@/api/user'
import { useUserStore } from '@/stores'
import { User, Lock} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref,watch} from 'vue'
import { useRouter } from 'vue-router'
const isRegister = ref(true)
const form = ref()
// 注册-要提交给后台，使用接口文档
// \S非空字符
const formModel = ref({
    username:'',
    password:'',
    repassword:''
})
const rules = {
    username:[
        { required: true, message: '用户名不能为空',   trigger: 'blur' },
        { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' },
    ],
    password:[
        { required: true, message: '请输入密码',   trigger: 'blur' },
        {pattern:/^\S{6,10}$/, message:'密码必须是6-10的非空字符',trigger:'blur'}
    ],
    repassword:[
        { required: true, message: '密码不能为空',   trigger: 'blur' },
        {pattern:/^\S{6,10}$/, message:'密码必须是6-10的非空字符',trigger:'blur'},
        {
            validator:(rule,value,callback)=>{
                if(value !== formModel.value.password){
                    callback(new Error('两次密码输入不一致'))
                }else{
                    callback()
                }
            },
            trigger:'blur'
        } 
    ]
}
const register = async() => {
    await form.value.validate()
    console.log(formModel.value)
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    isRegister.value = false
}
// 切换的的时候，重置表单内容
watch(isRegister,()=>{
    formModel.value = {
        username:'',
        password:'',
        repassword:''
    }
})
const userStore = useUserStore()
const router = useRouter()
const login=async ()=>{
    await form.value.validate()
    const res = await userLoginService(formModel.value)
    console.log("开始登录",res);
    // 存token
    userStore.setToken(res.data.token)
    router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
    <!-- 当 Vue 渲染 el-form 组件时，会自动把该组件的实例赋值给 form.value -->
      <el-form ref="form" size="large"  v-if="isRegister" :model="formModel" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
            
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="formModel.repassword"
            
          ></el-input>
        </el-form-item>
        <el-form-item @click="register">
          <el-button class="button" type="primary" auto-insert-space >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form ref="form" size="large"  v-else :model="formModel" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
            
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item @click="login">
          <el-button class="button" type="primary" auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>