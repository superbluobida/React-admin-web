import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
// import memoryUtils from '../../utils/memoryUtils'

import { Layout } from 'antd';

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

import NotFound from '../not-found/not-found';

import { connect } from 'react-redux';


const {Footer, Sider, Content } = Layout;

//后台管理的路由组件
class Admin extends Component {
  render() {

    // const user = memoryUtils.user
    const user = this.props.user

    if(!user || !user._id){//没有值，没有id属性
      //自动跳转到登录(在render()中)
      return <Redirect to='/login'/>
    }
    return (
        //后台管理的路由组件  {}JS代码{{}}JS对象
      <Layout style={{minHeight: '100%'}}> 
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin:20 ,backgroundColor: '#fff'}}>
            <Switch>
            <Redirect exact from='/' to='/home' />
              <Route path='/home' component ={Home}/>
              <Route path='/category' component ={Category}/>
              <Route path='/product' component ={Product}/>
              <Route path='/role' component ={Role}/>
              <Route path='/user' component ={User}/>
              <Route path='/charts/bar' component ={Bar}/>
              <Route path='/charts/line' component ={Line}/>
              <Route path='/charts/pie' component ={Pie}/>
              <Route component={NotFound}/>
            </Switch>
          </Content>
          <Footer style={{textAlign:'center', color:'#cccc'}}>推荐使用Google浏览器</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {} 
)(Admin)