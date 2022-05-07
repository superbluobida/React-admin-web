//能发送异步ajax请求的函数模块

import axios from 'axios'

import { message } from 'antd'

// 优化:统一处理请求异常?
    //在外层包一个Promise对象 
    // 在外层出错时，不rejuct()，而是显示错误提示

// 优化2：异步得到得不是response，而是response.data
    //在请求成功resolve时，resolve(response.data)

//有可能没有data，设置初始值为空对象
export default function ajax(url, data={}, type='GET'){

    return new Promise((resolve, reject)=>{

        let promise
        // 1.执行异步ajax请求
        if(type === 'GET'){
            promise = axios.get(url, {
                //配置对象（名字不能瞎写）
                params: data
            })
        }else{
            promise = axios.post(url,data)
        }
        // 2.如果成功了，调用resolve(value)
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{
            // 3.如果失败了，不调用reject(reason),而是提示异常信息
            message.error('请求出错了'+ error.message)
            })
    })
}

//请求登录接口
ajax('/login', {username: 'Tom', password: '12345'}, 'POST').then()
//添加用户
ajax('/manage/user/add', {username: 'Tom', password: '12345', phone: '15030008866'}, 'POST').then()
