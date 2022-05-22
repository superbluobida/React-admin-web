import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER,
} from './action-types'

import {reqLogin} from '../api'
import { message } from 'antd'
import storageUtils from '../utils/storageUtils'

// 设置头部标题的同步action
export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})

//接受用户信息的同步action
export const receiveUser = (user)=>({type:RECEIVE_USER,user})

//显示错误信息的同步action
export const showErrorMessage = (errorMsg)=>({type:SHOW_ERROR_MSG,errorMsg})

//退出登录的同步action
export const logout = ()=>{
    //1.删除local中的user
    storageUtils.removeUser()
    //2.返回action对象
    return {type:RESET_USER}
}


//实现登录的异步action
export const login = (username,password) => {
    return async dispatch =>{
        // 执行异步action请求
        const result = await reqLogin(username,password)
        if(result.status === 0){
            const user = result.data
            //保存在local中
            storageUtils.saveUser(user)

            dispatch(receiveUser(user))
        }else{
            const msg = result.msg
            // message.error(msg)
            dispatch(showErrorMessage(msg))
        }
    }
}