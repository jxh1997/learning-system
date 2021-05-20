// pages/my/mes/mes.js
const app = getApp()
const db = wx.cloud.database();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mess:[],
    userList: [],
    userListArray: [],
    index: 0,
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo.grade === 1) {
      this.getAllStuUsers();
    } else {
      this.getAllTeaUsers();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAllNews()
  },

  getAllNews() {
    let that = this;
    db.collection('interaction').get({
      success: res => {
        console.log(res);
        that.setData({
          mess: res.data
        })
      }
    })
  },

  // 获取发送对象
  getAllStuUsers() {
    let that = this;
    db.collection('users').where({
      grade: 2
    }).get({
      success: res => {
        let user = [];
        res.data.map(item => {
          let name = item.userid + '-' + item.username;
          user.push(name);
        })
        that.setData({
          userListArray: res.data,
          userList: user
        })
      }
    })
  },

  getAllTeaUsers() {
    console.log(app.globalData.userInfo.grade);
    let that = this;
    db.collection('users').where({
      grade: 1
    }).get({
      success: res => {
        let user = [];
        res.data.map(item => {
          let name = item.userid + '-' + item.username;
          user.push(name);
        })
        that.setData({
          userListArray: res.data,
          userList: user
        })
        console.log(that.data.userList , that.data.userListArray);
      }
    })
  },

   // 显示弹出按钮
   showDialogBtn: function () {
    // var time = util.formatTime(new Date());
    this.setData({
      showModal: true
    })
  },

  
    /**
    * 对话框取消按钮点击事件
    */
   onCancel: function () {
    this.hideModal();
  },
  /**
  * 对话框确认按钮点击事件
  */
  GetName: function (e) {
    var name = e.detail.value.hw_name//获取作业名

    this.hideModal();
    this.setData({
      hw_count: this.data.hw_count + 1
    })
    // wx.navigateTo({
    //   url: '/pages/course/component_t/homework/hw_create/hw_create?name=' + name,
    // })
  },
  /**
    * 隐藏模态对话框
    */
   hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  inputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  toSend() {
    let that = this;
    db.collection('interaction').add({
      data: {
        sendToUser: that.data.userListArray[that.data.index]._id,
        content: that.data.inputValue,
        sendTime: util.formatTime(new Date()),
        sendUserName: app.globalData.userInfo.username
      },
      success: res => {
        wx.showToast({
          title: '消息发送成功',
        })
        that.getAllNews()
      }
    })
  }
})