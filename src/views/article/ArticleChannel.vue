<script setup>
import {ref} from 'vue'
import { artDeleteChannelsService, artGetChannelsService } from '@/api/article'
import { Edit,Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const dialog = ref()
const channelList = ref([])
const loading = ref(false)
const getChannelList  = async ()=>{
    loading.value = true
    const res = await artGetChannelsService()
    channelList.value = res.data.data
    loading.value = false
}
getChannelList()
const onDelChannel = async (row)=>{
//    console.log(row)
    await ElMessageBox.confirm('你确认删除分类信息吗','温馨提示',{
        type:'warning',
        confirmButtonText:'确认',
        cancelButtonText:'取消'
    })
    await artDeleteChannelsService(row.id)
    ElMessage({type:'success',message:'删除成功'})
    getChannelList()
}
const onEditChannel = (row) =>{
    dialog.value.open(row)
}
const onAddChannel = ()=>{
    dialog.value.open({})
}
const onSuccess = ()=>{
    getChannelList()
}
</script>
<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button type="primary" @click="onAddChannel">添加分类</el-button>
        </template>
        <el-table v-loading="loading" :data="channelList" style="width:100%">
            <el-table-column width="100" label="序号" type="index"></el-table-column>
            <el-table-column prop="cate_name" label="分类名称"></el-table-column>
            <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
            <el-table-column width="100%" label="操作">
                <template #default="{ row,$index}">
                    <el-button
                    :icon="Edit"
                    circle 
                    plain
                    type="primary"
                    @click="onEditChannel(row,$index)"
                    ></el-button>
                    <el-button
                    :icon="Delete"
                    circle
                    plain
                    type="danger"
                    @click="onDelChannel(row,$index)"
                    ></el-button>
                </template>
            </el-table-column>
            <!-- 当表格的数据为空时，el-table 会自动去查找并渲染 empty 插槽里的内容。-->
            <template #empty>
                <el-empty description="没有数据"></el-empty>
            </template>
        </el-table>
    </page-container>
    <!-- 使用ref模板引用 -->
    <ChannelEdit ref="dialog" @success = 'onSuccess'></ChannelEdit>
</template>
