// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  toHelp: function (e) {
    wx.navigateTo({
      url: 'help/help',
    })
  },
  toFeedback: function (e) {
    wx.navigateTo({
      url: 'feedback/feedback',
    })
  },
  toSet: function (e) {
    wx.navigateTo({
      url: 'set/set',
    })
  },
  toEdit: function (e) {
    wx.navigateTo({
      url: '../editInfo/index',
    })
  }
})