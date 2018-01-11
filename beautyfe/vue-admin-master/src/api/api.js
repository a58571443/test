import axios from 'axios';

let base = '//47.97.167.88';
//登录
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
//分类
export const getUserListPage = params => { return axios.get(`${base}/category/list`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
//编辑category
export const editUser = params => { return axios.post(`${base}/category/createOrUpdate`, params).then(res => res.data); };
//新增category
export const addUser = params => { return axios.post(`${base}/category/createOrUpdate`, params).then(res => res.data); };
//分类
export const getkeywordList = params => { return axios.get(`${base}/keyword/list`, { params: params }); };
//编辑category
export const editKeyword = params => { return axios.post(`${base}/keyword/createOrUpdate`, params).then(res => res.data); };
//新增category
export const addKeyword = params => { return axios.post(`${base}/keyword/createOrUpdate`, params).then(res => res.data); };
//帖子列表
export const getpostsList = params => { return axios.get(`${base}/posts/list`, { params: params }); };
//编辑帖子
export const editPost = params => { return axios.post(`${base}/posts/createOrUpdate`, params).then(res => res.data); };
//新增帖子
export const addPost = params => { return axios.post(`${base}/posts/createOrUpdate`, params).then(res => res.data); };
//帖子审核
export const judgePost = params => { return axios.post(`${base}/posts/updateStatus`, params).then(res => res.data); };
//帖子类别
export const categoryPost = params => { return axios.post(`${base}/posts/updateCategory`, params).then(res => res.data); };
//修改帖子权重
export const updateRank = params => { return axios.post(`${base}/posts/updateRank`, params).then(res => res.data); };
//删除帖子关键字
export const delKeywords = params => { return axios.post(`${base}/posts/delKeyword`, params).then(res => res.data); };
//添加帖子关键字
export const addKeywords = params => { return axios.post(`${base}/posts/addKeyword`, params).then(res => res.data); };


//删除帖子图片
export const deleteImg = params => { return axios.post(`${base}/posts/delImage`, params).then(res => res.data); };
//添加帖子图片
export const addImg = params => { return axios.post(`${base}/posts/addImage`, params).then(res => res.data); };


//图片列表
export const getImageList = params => { return axios.get(`${base}/image/list`, { params: params }); };
//修改图片类别
export const updateImgCat = params =>{ return axios.post(`${base}/image/updateCategory`, params).then(res => res.data); };
//图片审核
export const judgeImg = params => { return axios.post(`${base}/image/updateStatus`, params).then(res => res.data); };
//删除图片关键字
export const delImgKeywords = params => { return axios.post(`${base}/image/delKeyword`, params).then(res => res.data); };
//添加图片关键字
export const addImgKeywords = params => { return axios.post(`${base}/image/addKeyword`, params).then(res => res.data); };
