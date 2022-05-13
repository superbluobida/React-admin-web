import React, { Component } from 'react'
import './index.less'

import { Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd';

import logo from '../../assets/images/logo.png'

//默认暴露的可以写任意值
import menuList from '../../config/menuConfig'

import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;

//左侧导航的文件
class leftNav extends Component {

  //判断当前用户对item是否有权限
  hasAuth = (item)=>{
    const {key,isPublic} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    //1.如果当前用户是admin 
    //2.如果当前item是公开的
    //3.当前用户有此item权限：key有没有在menus中
    if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
      return true
    }else if(item.children){
      //4.如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key)!==-1) 
    }
    return false
  }
  
  //根据munu的数据生成对应的标签数据
  //map() + 递归
  getMenuNodes_map = (menuList)=>{
    return menuList.map(item => {
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
            <Icon type={item.Icon}/>
            <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else{
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.Icon}  />
                <span>{item.title}</span>
              </span>
            }
          > 
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }

  //根据munu的数据生成对应的标签数据
  //reduce() + 递归
  getMenuNodes = (menuList)=>{

    //得到当前请求的路由路径
    const path = this.props.location.pathname

    return menuList.reduce((pre,item)=>{

      //如果当前用户有item对应的权限，才需要显示对应的菜单项
      if(this.hasAuth(item)){
        if(!item.children){
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
              <Icon type={item.Icon}/>
              <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        }else{
  
          //查找一个与当前请求路径匹配的子Item
          const CItem = item.children.find(CItem=>path.indexOf(CItem.key)===0)
          //如果存在，说明当前item的子列表需要打开
          if(CItem){
            this.openKey = item.key
          }
          pre.push((<SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.Icon}  />
                <span>{item.title}</span>
              </span>
            }
          > 
            {this.getMenuNodes(item.children)}
          </SubMenu>))
        }
      }
      return pre
    },[])
  }

  //在第一次render()之前执行一次
  //为第一次render()准备数据(同步)
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname

    if(path.indexOf('/product')===0){
      //当前请求的是商品或其子路由界面
      path = '/product'
    }

    //得到需要打开菜单项的key
    const openKey = this.openKey

    return (
      <div>
      <div to='/' className='left-nav' >
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt=''/>
          <h1>商品后台</h1>
        </Link>
      </div>
      
      <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
        {
          this.menuNodes

          //写死
          /* <Menu.Item key="1">
            <Link to='/home'>
            <Icon type="pie-chart" />
            <span>首页</span>
            </Link>
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>商品</span>
              </span>
            }
          >
            <Menu.Item key="5">
              <Link to="/category">
                <span>
                  <Icon type="mail" />
                  <span>品类管理</span>
                </span>              
              </Link>  
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/product">
                <span>
                  <Icon type="mail" />
                  <span>商品管理</span>
                </span>               
              </Link>
            </Menu.Item>
          </SubMenu> */
          }
        </Menu>
      
      </div>
    )
  }
}


export default withRouter(leftNav)