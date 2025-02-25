<script setup>
import { artGetChannelsService } from '@/api/article';
import {ref} from 'vue'
defineProps({
    modelValue:{
        type:[Number,String]
    },
    width:{
        type:String
    }
})
const emit  = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async ()=>{
    const res = await artGetChannelsService()
    channelList.value = res.data.data
} 
getChannelList()

</script>

<template>
    <!-- update:modelValue是指的是下拉框里面的值--在这里指的是list.id -->
    <!-- 不能使用v-model,会修改父组件的数据 -->
     <!-- {width} 是一个对象字面量的简写形式, { width: width } -->
    <el-select style="width:150px"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue',$event)"
    :style="{width}"
    >
        <el-option v-for="list in channelList" :key="list.id" :label="list.cate_name" :value="list.id"></el-option>
    </el-select>
</template>