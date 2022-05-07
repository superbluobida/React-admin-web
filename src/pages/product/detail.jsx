import React, { Component } from 'react'

import {Card,Icon,List} from 'antd'
import LinkButton from '../../components/link-button'

import {BASE_IMG_URL} from '../../utils/constants'

import {reqCategory} from '../../api'

const Item = List.Item

//Product的详情子路由组件
export default class Detail extends Component {
  
  state = {
    cName:'',//一级分类名称
    cName2:'',//二级分类名成
  }

  async componentDidMount(){
    //得到当前商品分类的ID
    const {pCategoryId,categoryId} = this.props.location.state.product
    if(pCategoryId === '0'){//一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    }else{//二级分类下的商品
      //问题效率，（多个await，后面的请求在前一个请求成功返回后才发送）
      // const result1 = await reqCategory(pCategoryId) //获取一级分类列表
      // const result2 = await reqCategory(categoryId) //获取二级分类列表
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name
      
      //一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name  
      
      this.setState({cName1,cName2})
    } 
  
  }

  render() {

    //读取携带过来的state数据
    const {name,desc,price,detail,imgs} = this.props.location.state.product

    const {cName1,cName2} = this.state
    const title = (
      <span>
        <LinkButton>
          <Icon type='arrow-left' style={{color:'green', marginRight:15, fontSize:20}}
              onClick = {()=>this.props.history.goBack()}
          />
        </LinkButton> 
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span>{cName1} {cName2 ? '-->'+cName2 : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span>
              {
                imgs.map(img =>(
                  <img
                    key={img}
                    className='product-img'
                    src={BASE_IMG_URL + img}
                    alt='img'
                  />
                ))
              }
              
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:detail}}>
            </span>
          </Item>
        </List>
      </Card>
    )
  }
}


{/* <img className='product-img' src="https://p3.lefile.cn/product/adminweb/2021/10/14/xhbYSPxnIC9vvwdzJiHA4DDgE-7548.w520.jpg" alt=''/> */}
              // <img className='product-img' src="https://p2.lefile.cn/product/adminweb/2021/10/14/j7xRVgT6OXVS0Oy5So33SW8ua-7728.w520.jpg" alt=''/>