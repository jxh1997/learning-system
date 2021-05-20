const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    worksFinish: [],
    worksList: []
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
    db.collection('worksFinish').where({
      status: status
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          worksList: res.data
        })
        // that.getWorksList()
      }
    })
  },

  onShow: function() {
    let that = this;
    db.collection('worksFinish').where({
      status: that.data.status
    }).get({
      success: res => {
        that.setData({
          worksList: res.data
        })
      }
    })
  },
  // getWorksList() {
  //   this.data.worksFinish.map(item => {
  //     if(item.status === Number(this.data.status)) {
  //       console.log(item);
  //       that
  //     }
  //   })
  // },
  toExperiment: function (e) {
    var wokdsid = e.currentTarget.dataset.set
    wx.navigateTo({
      url: './wkSetShow/index?wokdsid=' + wokdsid,
    })
  },
})