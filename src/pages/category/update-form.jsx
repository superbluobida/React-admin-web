import React, { Component } from 'react'

import { Form, Select, Input,  } from 'antd'

import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

//更新分类的form组件
class UpdateForm extends Component {

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    
    //willmount同步，didmount异步
    componentWillMount(){
        //将Form对象通过setForm()传递父组件
        this.props.setForm(this.props.form)
    }

    render() {

    const {categoryName} = this.props

    const { getFieldDecorator } = this.props.form
    
    return (
        <Form>
            <Item>
            {
                getFieldDecorator('categoryName',{
                    initialValue: categoryName,
                    rules:[
                        {required: true,message:'分类名称必须输入'}
                    ]
                })(
                    <Input placeholder='请输入分类名称'></Input>
                )
            }
            </Item>
        </Form>
    )
  }
}

export default Form.create()(UpdateForm)