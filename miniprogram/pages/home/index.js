// miniprogram/pages/index/index.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    // 轮播图片
    swiperList: [
      { id: 1, img: '../../assets/images/1.png' },
      { id: 2, img: '../../assets/images/2.png' },
      { id: 3, img: '../../assets/images/3.png' }
    ],
    // 教学资源
    courseList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourseList();
  },

  // 获取课程信息
  getCourseList: function () {
    var that = this;
    wx.showLoading({
      title: '教学资源获取中...',
    });

    db.collection('resources').get({
      success(res) {
        wx.hideLoading();
        console.log("courseList: " , res);
        that.setData({
          courseList: res.data
        })
      }
    })
  },

  // 进入课程详情
  intro(e) {
    var that = this;
    var courseList = that.data.courseList;
    var courseId = e.currentTarget.dataset.id;
    console.log(courseId);

    wx.navigateTo({
      url: '../course/index?courseId=' + courseId
    })
  },

  // 加入
  toAdd: function(e) {
    wx.showActionSheet({
      itemList: ["创建课程", "发布作业", "课后练习"],
      success: function(e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '../createCourse/index',
          })
        } else if (e.tapIndex == 1) {
          wx.navigateTo({
            url: '../createWorks/index',
          })
        } else if (e.tapIndex == 2) {
          wx.navigateTo({
            url: '../createHomeWorks/index',
          })
        }
      }
    })
  }
})