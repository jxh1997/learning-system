// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      grade: app.globalData.userInfo.grade
    })
  },

  toCourse: function (e) {
    wx.switchTab({
      url: '../home/index'
    })
  },
  toMes: function (e) {
    wx.switchTab({
      url: '../news/index',
    })
  },
  toWorks: function (e) {
    wx.navigateTo({
      url: '../createWorks/index',
    })
  },
  toFeedback: function (e) {
    wx.navigateTo({
      url: '../createWorks/wkSee/index?status=' + 0,
    })
  },
  toMyWorks: function (e) {
    wx.navigateTo({
      url: '../createWorks/wkSee/index?status=' + 1,
    })
  },
  toMyHomeWorks: function (e) {
    wx.navigateTo({
      url: '../createHomeWorks/index',
    })
  },
  toSet: function (e) {
    wx.navigateTo({
      url: '../createWorks/wkSet/index?status=' + 1,
    })
  },
  toEdit: function (e) {
    wx.navigateTo({
      url: '../editInfo/index',
    })
  },
  outLogin: function() {
    app.globalData.userInfo = {};
    wx.navigateTo({
      url: '../login/index',
    })
  },
  onShow: function () {
        this.setData({
          grade: app.globalData.userInfo.grade
        })
      },
})