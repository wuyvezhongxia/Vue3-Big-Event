import request  from '@/utils/request'
export const userRegisterService = ({username,password,repassword}) => request.post('/api/reg', {username,password,repassword})
export const userLoginService = ({username,password}) => request.post('/api/login', {username,password})
export const userInfoService = ()=>request.get('/my/userinfo')
export const userUpdateService = (data)=>request.put('/my/userinfo',data)
export const userUpdateAvatarService = (avatar)=>request.patch('/my/update/avatar',avatar)
export const userUpdatePassService = (data)=>request.patch('/my/updatepwd',data)