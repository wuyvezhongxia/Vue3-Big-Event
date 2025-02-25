<script setup>
import { artGetListService } from '@/api/article.js'
import ChannelSelect from './components/ChannelSelect.vue'
import { Delete,Edit } from '@element-plus/icons-vue'
import {ref} from 'vue'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
const articleList = ref ([])
const artTotal = ref(0)
const loading = ref(false)
const params = ref({
    pagenum:1,  
    pagesize:5, //当前生效的每页条数
    cate_id:'',
    state:'',
})
const getArticleList = async () => {
    // console.log(params.value)
    loading.value = true
    const res = await artGetListService(params.value)
    // console.log(res)
    articleList.value = res.data.data
    artTotal.value = res.data.total
    loading.value = false
}
getArticleList()

const onSearch = ()=>{
    params.value.pagenum = 1
    getArticleList()
}
const onReset = ()=>{
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}

const articleEditRef = ref()
// 添加和编辑公用抽屉

const onAddArticle = ()=>{
    articleEditRef.value.open({})
}

const onSuccess = (type)=>{
    if(type==='add'){
        const lastPage = Math.ceil((artTotal.value+1)/params.value.pagesize)
        params.value.pagenum = lastPage
    }
    getArticleList()
}

const onEditArticle = row =>{
    articleEditRef.value.open(row)
}
const onDelArticle = row=>{
    articleEditRef.value.delArticle(row.id)
    getArticleList()
}
// 当前每页条数--重新渲染
const onSizeChange = size => {
    params.value.pagenum = 1 
    params.value.pagesize = size
    getArticleList()    
}
// 页码发生变化
const onCurrentChange = page => {
    params.value.pagenum = page
    getArticleList()
}
</script>

<template>
    <page-container title="文章管理">
        <template #extra>
            <el-button type="primary" @click="onAddArticle">添加文章</el-button>
        </template>
        <el-form inline>
            <el-form-item label="文章分类：">
                <ChannelSelect v-model="params.cate_id"></ChannelSelect>
            </el-form-item>
             <el-form-item label="发布状态：">
                <el-select style="width:150px" v-model="params.state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item>
                <el-button @click="onSearch" type="primary">搜索</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="articleList" style="width:100%" v-loading="loading">
            <el-table-column label="文章标题" width="200">
                <template #default="{row}">
                    <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="cate_name"></el-table-column>
            <el-table-column label="发表时间" prop="pub_date">
                <template #default="{row}">{{ formatTime(row.pub_date) }}</template>
            </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button 
                    :icon="Edit"
                    circle
                    plain
                    type="primary"
                    @click="onEditArticle(row)"
                    ></el-button>
                    <el-button 
                    :icon="Delete"
                    circle
                    plain
                    type="danger"
                    @click="onDelArticle(row)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table> 
        <el-pagination
        v-model:current-page="params.pagenum"
        v-model:page-size="params.pagesize"
        :page-sizes="[3,5,7]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="artTotal"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top:20px;justify-content: flex-end;"
        />
        <ArticleEdit ref = 'articleEditRef' @success = "onSuccess"></ArticleEdit>
    </page-container>
</template>