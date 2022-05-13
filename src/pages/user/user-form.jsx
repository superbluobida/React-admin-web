import React, { Component } from 'react'

import { Form, Select, Input,  } from 'antd'

import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

//添加/修改用户的form组件
class UserForm extends Component {
  
    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user:PropTypes.object 
    } 
  
    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
    const { getFieldDecorator } = this.props.form
    
    const {roles} = this.props
    const user = this.props.user
    //指定Item布局的配置对象
    const formItemLayout = {
        labelCol: {span:4}, //左侧label的宽度
        wrapperCol:{span:15},//指定右侧包裹的宽度
        }

    return (
        <Form  {...formItemLayout}>
            <Item label='用户名'>
            {
                getFieldDecorator('username',{
                    initialValue: user.username,
                })(
                    <Input placeholder='请输入角色名称'></Input>
                )
            }
            </Item>
            {
                user._id ? null : (
                    <Item label='密码'>
                    {
                        getFieldDecorator('password',{
                            initialValue: user.password,
                        })(
                            <Input type='password' placeholder='请输入密码'></Input>
                        )
                    }
                    </Item>
                )
            }
            <Item label='手机号'>
            {
                getFieldDecorator('phone',{
                    initialValue: user.phone,
                })(
                    <Input placeholder='请输入手机号'></Input>
                )
            }
            </Item>
            <Item label='邮箱'>
            {
                getFieldDecorator('email',{
                    initialValue: user.email,
                })(
                    <Input placeholder='请输入邮箱'></Input>
                )
            }
            </Item>
            <Item label='角色'>
            {
                getFieldDecorator('role_id',{
                    initialValue: user.role_id,
                })(
                    <Select>
                       {
                           roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                       }
                    </Select>
                )
            }
            </Item>
        </Form>
    )
  }
}

export default Form.create()(UserForm)