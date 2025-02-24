import request  from '@/utils/request'
export const artGetChannelsService = () => request.get('/my/cate/list')
export const artAddChannelsService = (data) => request.post('/my/cate/add',data)
export const artEditChannelsService = (data) => request.put('/my/cate/info',data)
export const artDeleteChannelsService = id => request.delete('/my/cate/del',{
    params:{id}
})