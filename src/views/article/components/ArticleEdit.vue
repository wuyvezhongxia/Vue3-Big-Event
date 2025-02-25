<script setup>
    // <!-- 对外暴露的方法，是用来区分添加还是编辑 
    //     {} 添加
    //     open调用后，可以打开弹窗
    //  -->
import {ref} from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artDelDetailService, artGetDetailService, artPublishService, artUpdateDetailService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)
const defaultForm = {
    title:'',
    cate_id:'',
    cover_img:'',
    content:'',
    state:''
}

const imgUrl = ref('')
// 使用 URL.createObjectURL() 方法为选择的文件创建一个临时的 URL，并将其赋值给 imgUrl，这样在模板中就可以显示该文件的预览图。
const onUploadFile = (uploadFile)=>{
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    // console.log(imgUrl.value);
    formModel.value.cover_img = uploadFile.raw
    // console.log(uploadFile);
}

const formModel = ref({
    ...defaultForm
})
// 发布
// 发布显示最后一页，编辑显示当前页
const emit = defineEmits(["success"])
const onPublish = async (state)=>{
    formModel.value.state = state
    // 转换formData数据 
    const fd = new FormData()
    for(let key in formModel.value) {
        fd.append(key,formModel.value[key])
    }
    if(formModel.value.id) {
        // console.log('编辑操作');
        await artUpdateDetailService(fd)
        ElMessage.success('修改成功')
         visibleDrawer.value = false
        emit('success','edit')
    }else{
        await artPublishService(fd)
        ElMessage.success('添加成功')
        visibleDrawer.value = false
        emit('success','add')
    }
}
const formRef = ref()
const editorRef = ref()
// 回显
const open = async (row) => {
    visibleDrawer.value = true
    if(row.id) {
        //编辑需要进行回显，需要的数据，row没有，所以需要发送请求，获取编辑对应的详情数据
        const res = await artGetDetailService(row.id)
        // 因为 formModel 是 Vue 的响应式对象,额外的属性会随着赋值操作被添加到 formModel.value 中
        formModel.value = res.data.data
        imgUrl.value = baseURL + formModel.value.cover_img
        // 提交给后台，需要的数据格式是file, 存储起来,将来便于提交
        const file = await imageUrlToFileObject(imgUrl.value,formModel.value.cover_img)
        formModel.value.cover_img = file        
    }else{
        // 添加---要重置数据---基于默认的数据
        formModel.value = {
            ...defaultForm
        }
        imgUrl.value = ''
        // 编辑器重置
        editorRef.value.setHTML('')
    }
}
const delArticle = async (id)=>{
    await artDelDetailService(id)
}
defineExpose({
    open,
    delArticle
})
async function imageUrlToFileObject(imageUrl, filename) {
    try {
        // 使用 Axios 下载图片数据
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        // 将下载的数据转换成 Blob 对象
        const blob = new Blob([response.data], {
            type: response.headers['content-type']
        });
        // 创建 File 对象
        const file = new File([blob], filename, { type: blob.type });
        return file;
    } catch (error) {
        console.error('图片下载或转换失败:', error);
        return null
    }
}
</script>

<template>
    <el-drawer v-model="visibleDrawer" :title="formModel.id?'编辑文章':'添加文章'" direction="rtl" size="50%">
        <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img"> 
        <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :on-change ="onUploadFile"
        >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
            <!-- 富文本编辑器 -->
            <QuillEditor 
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
    </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>