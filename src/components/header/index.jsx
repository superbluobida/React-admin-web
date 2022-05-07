import React, { Component } from 'react'
import './index.less'

import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'

import { reqWeather } from '../../api'

import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'

import { Modal } from 'antd';

import storageUtils from '../../utils/storageUtils'

import LinkButton from '../link-button'

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()),
    weather: '',
    temperature: ''
  }

  getTime = ()=>{
    this.intervalId = setInterval(()=>{
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  getWeather = async()=>{
    const {weather, temperature} = await reqWeather('310000') //城市代码
    this.setState({weather,temperature})
  }

  getTitle = ()=>{
    //得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach(item=>{
      if(item.key === path){
        title = item.title
      }else if(item.children){
        const cItem = item.children.find(cItem=> path.indexOf(cItem.key)===0)
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = ()=>{
    Modal.confirm({
      content: '确定退出吗',
      //改为箭头函数（this）
      onOk: ()=>{
        // console.log('OK');
        //删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}
        //跳到Login
        this.props.history.replace('/login')
      },
    })
  }

  //第一次render()之后执行一次
  //一般在此执行异步操作:发Ajax请求/启动定时器
  componentDidMount(){
    this.getTime()
    this.getWeather()
  }

  //当前组件卸载之前调用
  componentWillUnmount(){
    clearInterval(this.intervalId)
  }

  render() {

    const {currentTime,weather,temperature} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()

    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span>{weather}</span>
            <span>{temperature}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)