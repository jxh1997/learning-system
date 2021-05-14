const app = getApp()
const db = wx.cloud.database();
var util = require('../../../../utils/util.js');

// pages/course/component_t/experiment/ex_show/ex_show.js
Page({
  data: {
    wokdsid: '',
    worksList: {},
    worksAnswer: '',
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

  bindInput(e) {
    this.setData({
      worksAnswer: e.detail.value
    })
  },

  // 重新提交
  setWorksStatus1() {
    var that = this;
    db.collection('worksFinish').doc(that.data.wokdsid).update({
      data: {
        worksAnswer: that.data.worksAnswer,
        status: 1,
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: '重新提交成功！',
          icon: 'success'
        })
        setTimeout(() => {
          wx.navigateBack({})
        } , 1500)
      }
    })
  },
})