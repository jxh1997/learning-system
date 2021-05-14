const app = getApp()
const db = wx.cloud.database();

// pages/course/component/detail/detail.js
Component({
  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',
    totalExperiments:0,
    exList: [],
    grade: 2,
  },
  pageLifetimes:{
    show(){
      this.getAllExperimentList();
    },
    hide(){}
  },

  attached() {
    this.getAllExperimentList();
    this.setData({
      grade: app.globalData.userInfo.grade
    })
  },
 
  methods: {
    //获取所有课程实验信息
    getAllExperimentList: function () {
      var that = this;
      wx.showLoading({
        title: '请等待，加载中...',
      });

      db.collection('works2').get({
        success(res) {
          wx.hideLoading();
          console.log("aaa:" , res);
          that.setData({
            exList: res.data,
            totalExperiments: res.data.length
          })
        }
      })
    },

    toExperiment: function (e) {
      // 利用index顺序索引进行进入下一个页面
      var wokdsid = e.currentTarget.dataset.set
      wx.navigateTo({
        url: './wkShow/index?wokdsid=' + wokdsid,
      })
    },

    // 作业创建
    gotoWkCreate() {
      wx.navigateTo({
        url: './wkCreate/index',
      })
    },

  },

})