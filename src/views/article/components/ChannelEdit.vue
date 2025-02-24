<script setup>
import { artAddChannelsService, artEditChannelsService } from '@/api/article'
import { ElMessage } from 'element-plus'
import {ref} from 'vue'
const dialogVisible = ref(false)
const open = async (row)=>{
    dialogVisible.value = true
    // console.log(row)
    // 重置了表单内容，存储了回显内容
    formModel.value=row
    
}
defineExpose({
    open
})
const formModel = ref({
    cate_name:'',
    cate_alias:''
})
const rules = {
    cate_name:[
       {required:true, message:"请输入分类名称", trigger:'blur'},
       {
        pattern:/^\S{1,10}$/,
        message:'分类名必须是1-10位的非空字符',
        trigger:'blur'
       }
    ],
    cate_alias:[
       {required:true, message:'请输入分类别名',trigger:'blur'},
       {
        pattern:/^\S[a-zA-Z0-9]{1,15}$/,
        message:'分类名必须是1-15位的非空字符',
        trigger:'blur'
       }
    ]
}
const formRef = ref()
//表单发送请求时，应先通过校验，校验通过，再发送请求
const emit = defineEmits(['success'])
// 通知父组件回显
const onSumbit = async ()=>{
    await formRef.value.validate()
    formModel.value.id
    ? await artEditChannelsService(formModel.value)
    : await artAddChannelsService(formModel.value)
    ElMessage({
        type:'success',
        message:formModel.value.id?'编辑成功':'添加成功'
    })
    dialogVisible.value = false
    emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id?'编辑分类':'添加分类'"
    width="40%"
  >
    <el-form :model="formModel" :rules="rules" label-width="100px" ref="formRef">
        <el-form-item label="分类名称" prop="cate_name">
            <el-input placeholder="请输入分类名称" v-model="formModel.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
            <el-input placeholder="请输入分类别名" v-model="formModel.cate_alias"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSumbit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>