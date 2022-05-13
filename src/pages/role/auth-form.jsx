import React, { PureComponent } from 'react'

import { Form, Input, Tree } from 'antd'

import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;
//添加分类的form组件
export default class AuthForm extends PureComponent {
  
    static propTypes = {
        role: PropTypes.object
    } 
    
    constructor(props){
        super(props)

        //根据传入角色生成的初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //为父组件提交获取最新的menus数据的方法
    getMenus = ()=> this.state.checkedKeys

    getTreeNodes = (menuList)=>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key = {item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        },[])
    }

    //选中某个node时的回调
    onCheck = checkedKeys=>{
        this.setState({checkedKeys})
    }

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList) 
    }


    //根据传入的role来更新checkedKeys状态

  //当组件接受到新的属性时自动调用
  componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus
    
    //两种方式都可以
    //法一
    // this.setState({
    //   checkedKeys : menus
    // })
    //法二
    this.state.checkedKeys = menus
  }

    render() {
    
        const {role} = this.props

        const {checkedKeys} = this.state

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span:4}, //左侧label的宽度
            wrapperCol:{span:15},//指定右侧包裹的宽度
            }

        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled></Input>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll = {true}
                    checkedKeys = {checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>

            </div>
        )
  }
}

