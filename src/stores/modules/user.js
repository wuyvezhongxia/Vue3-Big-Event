import { userInfoService } from "@/api/user"
import { defineStore } from "pinia"
import {ref} from 'vue'
export const useUserStore = defineStore('big-user',()=>{
    const token = ref('')
    const setToken = (newToken)=>{
        token.value = newToken
    }
    const removeToken = ()=>{
        token.value = ''
    }

    const user = ref({})
    const getUser = async ()=>{
        const res = await userInfoService()
        user.value = res.data.data
    }
    const setUser = async ()=>{
        user.value = ''
    }
    return {
        token,
        setToken,
        removeToken,
        user,
        getUser,
        setUser
    }
},{
   persist:true 
})