const app = getApp()
const db = wx.cloud.database();
var util = require('../../../../utils/util.js');

// pages/course/component_t/experiment/ex_show/ex_show.js
Page({
  data: {
    wokdsid: '',
    worksList: {},
    worksTj: '',
    score: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var wokdsid = options.wokdsid;
    this.setData({
      wokdsid: wokdsid
    })
    
    this.getWorksFinish()
  },

  getWorksFinish() {
    let that = this;
    db.collection('worksFinish').doc(that.data.wokdsid).get({
      success: res => {
        that.setData({
          worksList: res.data
        })
      }
    })
  },

  // 批阅通过
  setWorksStatus1() {
    let that = this;
    wx.cloud.callFunction({
      name: 'setWorks',
      data: {
        id: that.data.wokdsid,
        status: 2,
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: '批阅成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        } , 1500)
      }
    })
    
  },
  
  // 批阅驳回
  setWorksStatus2() {
    let that = this;
    wx.cloud.callFunction({
      name: 'setWorks',
      data: {
        id: that.data.wokdsid,
        status: 3,
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: '驳回成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        } , 1500)
        
      }
    })
    
  },
})