//包含应用中所有接口请求函数的模块

import ajax from './ajax'

import jsonp from 'jsonp'
import { message } from 'antd'

// export function reqLogin(username, password){
//     ajax('/login', {username, password}, 'POST')
// }


//登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')


//获取一级/二级分类的列表
export const reqCategorys = (parentId)=> ajax('/manage/category/list',{parentId})
//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax('/manage/category/add',{categoryName,parentId},'POST')
//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryId,categoryName},'POST')

//获取一个分类
export const reqCategory = (categoryId)=> ajax('/manage/category/info',{categoryId})

//获取商品分类列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})

//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId,status) => ajax('./manage/product/updateStatus',{productId,status},'POST')


//搜索商品分页列表(根据商品名称/商品描述)
//searchType:搜索的类型,productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName //变量值作为属性名时加[]
})

//删除指定名称的图片接口
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//添加/更新商品
export const reqAddorUpdateProduct = (product)=>ajax('/manage/product/' + (product._id ? 'update' : 'add') ,product,'POST')

//获取所有角色的列表
export const reqRoles = ()=> ajax('/manage/role/list') 

//添加角色
export const reqAddRole = (roleName)=> ajax('/manage/role/add/',{roleName},'POST') 



//Jsonp请求的接口请求函数
export const reqWeather = (city)=>{
    return new Promise((resolve,reject)=>{
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=189037f8ca5add1d98d09c0586b4867d&city=${city}&extensions=base&output=JSON`
        jsonp(url,{},(err,data)=>{
            console.log('Jsonp()', err,data)
            if(!err && data.status ==='1'){
                const {weather,temperature} = data.lives[0]
                resolve({weather,temperature})
            }else{
                message.error('获取天气信息失败')
            }
        })
    })
    
}



// reqWeather('310000')