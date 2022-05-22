import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'
import logo from '../../assets/images/logo.png'

// import {reqLogin} from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'

import {login} from '../../redux/actions'
 
import { Redirect } from 'react-router-dom';

import {connect} from 'react-redux'

//登录的路由组件 
class Login extends Component {

  handleSubmit = (event) =>{
    //阻止事件的默认行为
    event.preventDefault()

    //对所有的表单字段进行校验
    this.props.form.validateFields(async (err, values) => {
      //校验成功
      if (!err) {
        // console.log('提交登录的Ajax请求', values);
        const {username, password} = values
        // reqLogin(username, password).then(response =>{
        //   console.log('成功了', response.data)
        // }).catch(error =>{
        //   console.log('失败了', error)
        // })

        // try{
        //   const response = await reqLogin(username, password)
        //   console.log('请求成功', response.data)
        // }catch(error){
        //   alert('请求出错了'+ error.message)
        // }

        // const result = await reqLogin(username, password)
        // if(result.status === 0){
        //   //提示登录成功
        //   message.success('登录成功')

        //   const user = result.data

        //   memoryUtils.user = user
        //   storageUtils.saveUser(user)
          
        //   //跳转到管理界面
        //   this.props.history.replace('/home')
        // }else{
        //   message.error(result.msg)
        // }

        //调用分发异步action => 发登录的异步请求，有了结果后更新状态
        this.props.login(username, password)

      }else{
        console.log('校验失败！');
      }
    });



    // const form = this.props.form
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()',values)
  }

  //对密码进行自定义验证
  validatePwd = (rule, value, callback)=>{
    if(!value){
      callback('密码必须输入')
    }else if(value.length<4){
      callback('密码长度不能小于4')
    }else if(value.length>12){
      callback('密码长度不能大于12')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须为英文、数字或者下划线组成')
    }else{
      callback()
    } 
    
    
    //callback()//验证通过
    //callback('XXX')//验证失败，并返回提示的文本
  }

  render() {

    //如果用户已经登录，自动跳转到管理界面
    // const user = memoryUtils.user
    const user = this.props.user

    if(user && user._id){
      return <Redirect to='/home'/>
    }

    const errorMsg = this.props.user.errorMsg


    const form = this.props.form
    const { getFieldDecorator } = form;

    return (
      <div className='login'>
        <header className='login-header'>
        <img src={logo} alt='logo'></img>
        <h1>React:后台管理系统</h1>
        </header>
        <section className='login-content'>
          <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
            {
              getFieldDecorator('username',{
                //声明式验证：直接使用别人定义好的验证规则进行验证
                rules:[
                  {required: true, whitespace:true, message:'用户名必须输入'},  //输入空格相当于没输 whitespace:true
                  {min: 4, message:'用户名最少4位'},
                  {max : 12, message:'用户名最多12位'},
                  {pattern: /^[a-zA-Z0-9_]+$/, message:'用户名必须为英文、数字或者下划线组成'}
                ],
                initialValue: 'admin' //指定初始值
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="账号"
                />,
              )
            }
            </Form.Item>
            <Form.Item>
            {
              getFieldDecorator('password',{
                rules:[
                  {validator: this.validatePwd}//自定义验证
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )
            }                
            </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

//包装From组件生成一个新的组件：Form(Login)
//新组建会向From组件传递一个强大的对象属性：form
const WrapLogin = Form.create()(Login)
export default connect(
  state => ({user: state.user}),
  {login}
)(WrapLogin)