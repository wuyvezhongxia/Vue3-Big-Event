<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import {Plus,Upload} from '@element-plus/icons-vue'
import {useUserStore} from '@/stores'
import {userUpdateAvatarService} from '@/api/user'
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const onUploadFile = (uploadFile)=>{
    // imgUrl.value = URL.createObjectURL(uploadFile.raw)
    // 基于fileReader对象，将图片转换为base64格式
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = ()=>{
        imgUrl.value = reader.result
        // console.log(uploadFile.raw,imgUrl.value);
    }
    // avatar base64格式
}
const onUploadAvatar = async ()=> {
    // console.log('上传头像');
    // 当使用 request.patch 这类方法发送请求时，底层库（如 Axios）会自动将 JavaScript 对象序列化为符合 JSON 格式的字符串，这个过程中会把属性名加上双引号。
    const data = { avatar: imgUrl.value }
    await userUpdateAvatarService(data)
//    await userUpdateAvatarService(imgUrl.value)
    // 更新完，要重新渲染
    await userStore.getUser()
}
</script>
<template>
    <PageContainer title='更换图像'>
        <el-upload
        ref="uploadRef"
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="onUploadFile"
        >
            <img v-if='imgUrl' :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
        </el-upload>
        <br>
        <el-button @click="uploadRef.$el.querySelector('input').click()" type="primary" :icon="Plus" size="large">
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="onUploadAvatar">
          上传头像
        </el-button>
    </PageContainer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>