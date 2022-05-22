import React, { Component } from 'react'

import {Card,Button,Table, Checkbox,Modal, message} from 'antd'

import { PAGE_SIZE } from '../../utils/constants'

import { reqRoles,reqAddRole,reqUpdateRole } from '../../api'

import AddForm from './add-form'
import AuthForm from './auth-form'

// import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import {formateDate} from '../../utils/dateUtils'

import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
class Role extends Component {
  
  state = {
    roles: [], //所有角色的列表
    role: {}, //选中的role
    isShowAdd: false, //是否显示添加界面
    isShowAuth:false,//是否显示设置权限界面
  }

  constructor(props){
    super(props)

    this.auth = React.createRef()
  }

  getRoles = async ()=>{
     const result = await reqRoles()
     if(result.status ===0){
        const roles = result.data
        this.setState({
          roles
        })
     }
  }

  initColumn = ()=>{
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:(create_time)=> formateDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
      },
    ]
  }

  onRow = (role)=>{
    return {
      onClick:event => { //点击行
        this.setState({
          role
        })
      },
    }
  }

  //添加角色
  addRole = ()=> {
    //进行表单验证
    this.form.validateFields(async  (error,values)=>{
      if(!error){
        //隐藏确认框
        this.setState({
          isShowAdd:false
        })

      //收集输入数据
        const {roleName} = values
        this.form.resetFields() //重置输入数据
      
        //请求添加
        const result = await reqAddRole(roleName  )
        if(result.status === 0){
          //根据结果展示/更新列表显示  
          message.success('添加角色成功') 
          // 方法一重新请求：this.getRoles()
          
          //方法二：
          //新产生的角色
          const role =  result.data
          
          //更新roles状态
          // const roles = this.state.roles 不好
          
          //一般
          // const roles = [...this.state.roles]
          // role.push(role)
          // this.setState({
          //   roles
          // })

          //对象：适合state跟之前没关系。

          //更新roles状态，基于原本状态更新数据
          this.setState(state=>({
            roles:[...state.roles,role]
          }))
          
        }else{
          message.error('添加角色失败')
        }

      }
    })

  }

  //更新角色
  updateRole =async ()=>{

    //隐藏确认框
    this.setState({
      isShowAuth:false
    })

    const role = this.state.role
    //得到最新的menus
    const menus = this.auth.current.getMenus()
    
    // role.auth_time = Date.now()

    role.menus = menus
    // role.auth_name = memoryUtils.user.username
    role.auth_name = this.props.user.username

    //请求更新
    const result = await reqUpdateRole(role)
    if(result.status===0){

      
      //如果当前更新的是自己角色的权限，强制退出
      if(role._id === this.props.user.role_id){
        // memoryUtils.user = {}
        // storageUtils.removeUser() 
        // this.props.history.replace('.login')
        this.props.logout()

        message.success('当前角色权限成功，重新登录')
      }else{
        message.success('更新角色权限成功')
        this.setState(state =>({
          roles:[...this.state.roles]
        }))
      }
     
    }else{
      message.error('添加角色失败')
    }
  }

  componentWillMount(){
    this.initColumn()
  }

  componentDidMount(){
    this.getRoles()
  }


  render() {

    const {roles,role,isShowAdd,isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})} >设置角色权限</Button>
      </span>
    )



    return (
      <Card title = {title}>
        <Table 
          bordered
          rowKey = '_id'
          dataSource={roles} 
          columns={this.columns} 
          pagination={{defaultPageSize:PAGE_SIZE }}
          rowSelection = {{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect:(role)=>{//选择某个radio时回调
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({isShowAdd:false})
            this.form.resetFields()
          
          }}
        >
          <AddForm setForm = {(form)=> this.form = form}/>
        </Modal>
          
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=> {
            this.setState({isShowAuth:false})
          
          }}
        >
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role)