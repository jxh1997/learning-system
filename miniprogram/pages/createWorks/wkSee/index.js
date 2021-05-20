const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    worksFinish: [],
    worksList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var status = Number(options.status);
    this.setData({
      status: status
    })
    console.log(status);
    let that = this;
    const _ = db.command
    db.collection('worksFinish').where({
      status: _.neq(0)
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          worksList: res.data
        })
        console.log(that.data.worksList);
        // that.getWorksList()
      }
    })
  },

  onShow: function() {
    let that = this;
    const _ = db.command
    db.collection('worksFinish').where({
      status: _.neq(0)
    }).get({
      success: res => {
        that.setData({
          worksList: res.data
        })
      }
    })
  },

  toExperiment: function (e) {
    var wokdsid = e.currentTarget.dataset.set
    console.log(wokdsid);
    wx.navigateTo({
      url: './wkSetShow/index?wokdsid=' + wokdsid,
    })
  },
})