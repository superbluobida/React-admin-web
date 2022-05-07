import React from "react";
import ReactDOM from "react-dom";

import App from './App'

import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
//读取Local中的user，保存在内存中
const user = storageUtils.getUser()
memoryUtils.user = user


ReactDOM.render(<App/>,document.getElementById("root"))