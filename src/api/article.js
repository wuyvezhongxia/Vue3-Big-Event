import request  from '@/utils/request'
// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')
export const artAddChannelsService = (data) => request.post('/my/cate/add',data)
export const artEditChannelsService = (data) => request.put('/my/cate/info',data)
export const artDeleteChannelsService = id => request.delete('/my/cate/del',{
    params:{id}
})
// 获取文章
export const artGetListService = (params) => 
     request.get('/my/article/list', {
        params
    })
// data是一个formDate格式的对象
export const artPublishService = (data) =>
  request.post('/my/article/add', data)
export const artGetDetailService = (id)=>
    request.get('/my/article/info',{
        params:{id}
    })
export const artUpdateDetailService = (data)=>
    request.put('/my/article/info',data)
export const artDelDetailService = (id)=>
    request.delete('/my/article/info',{
        params:{id}
    })