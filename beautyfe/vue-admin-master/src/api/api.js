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
