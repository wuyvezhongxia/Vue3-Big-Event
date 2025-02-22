import { createRouter, createWebHistory } from 'vue-router'
import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import ArticleManage from '@/views/article/ArticleManage.vue'
import ArticleChannel from '@/views/article/ArticleChannel.vue'
import UserAvatar from '@/views/user/UserAvatar.vue'
import UserPassword from '@/views/user/UserPassword.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import { useUserStore } from '@/stores'
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/jd'),
  routes: [
    {path:'/login',component:()=>import('@/views/login/LoginPage.vue')},
    {
      path:'/',
      component:LayoutContainer,
      redirect:'/article/manage',
      children:[
        {
          path:'/article/manage',
          component:ArticleManage
        },
        {
          path:'/article/channel',
          component:ArticleChannel
        },
        {
          path:'/user/profile',
          component:UserProfile
        },
        {
          path:'/user/avatar',
          component:UserAvatar
        },
        {
          path:'/user/password',
          component:UserPassword
        }
      ]
    }
  ],
})
// 登陆访问拦截
router.beforeEach((to)=>{
  const userStore = useUserStore()
  if(!userStore.token&&to.path!=='/login') return '/login'
})

export default router
