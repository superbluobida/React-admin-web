import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';

import {reqDeleteImg} from '../../api'

import propTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants';

//用于图片上传的组件 
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  
   static propTypes = {
       imgs: propTypes.array
   }
  
    constructor(props){
        super(props)

        let fileList = []
        //如果传入imgs属性
        const {imgs} = this.props
        if(imgs && imgs.length > 0){
            fileList = imgs.map((img,index) =>({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            })) 
        }

        //初始化状态
        this.state = {
            previewVisible: false, //标识是否显示大图预览
            previewImage: '', //大图的url
            fileList //所有已上传图片的数组
        }
}

  //获取所有上传图片文件名的数组
  getImgs = ()=>{
      return this.state.fileList.map(file => file.name)
  }


  //隐藏Modal
  handleCancel =  () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //显示指定file对应的大图
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //file: 当前操作的图片文件(上传/删除)
  //fileList :所有已上传图片文件对象的数组
  handleChange = async ({ file,fileList }) => {
    console.log('handleChange()',file,fileList)

    //一但上传成功，将当前上传的file信息修正(name，url)
    if(file.status==='done'){
        const result = file.response // {status:0,data:{name:'xxx.jpg',url:'图片地址'}}
        if(result.status === 0){
            message.success('上传图片成功')
            const {name,url} = result.data
            file = fileList[fileList.length-1]
            file.name = name
            file.url = url
        }else{
            message.error('上传图片失败')
        }
    }else if(file.status === 'removed'){ //删除图片
        const result = await reqDeleteImg(file.name)
        if(result.status === 0){
            console.log('!!!!!')
            message.success('删除图片成功')
        }else{
            message.error('输出图片失败')
        }
    }

    //在操作(上传/删除)过程中更新fileList状态
    this.setState({ fileList })
  }

  render(){
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" //上传图片的接口地址
          accept='image/*' // 只接受图片格式
          name = 'image'  //请求参数名
          listType="picture-card" //卡片样式
          fileList={fileList} //所有已上传图片的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
