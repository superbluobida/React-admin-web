// 进行local数据存储管理模块
import store from 'store'

const USER_KEY = 'user_key'

export default {
    // 保存user
    saveUser(user){
        // localStorage.setItem(USER_KEY, JSON.stringify(user)) //对象变为字符串
        store.set(USER_KEY, user)
    },
    // 读取user
    getUser(){
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },
    // 删除user
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        return store.remove(USER_KEY)
    }
}