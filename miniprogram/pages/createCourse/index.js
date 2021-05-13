const app = getApp()
const db = wx.cloud.database();
var util = require('../../utils/util')

Page({
  data: {
    courseImg: "../../assets/images/icon/add2.png",
    courseId: '',
    courseName: ''
  },

  onLoad: function (options) {
  },

  // 获取课程名
  getCourseName(e) {
    this.setData({
      courseName: e.detail.value
    })
  },

  // 选择图片
  chooseCourseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths[0];
        var courseId = that.data.courseId;
        let houzhui = tempFilePaths.split('.')[1]

        wx.showLoading({
          title: '封面上传中...',
        })
        wx.cloud.uploadFile({
          cloudPath: "course_from/" + that.data.courseName + '.' + houzhui,
          filePath: tempFilePaths,
          success: res => {
            console.log("上传成功", res);
            wx.showToast({
              title: '封面上传成功',
            })
            //显示当前选中的封面
            that.setData({
              courseImg: res.fileID
            });
          }
        })
      }
    })
  },

  // 创建课程
  createCourse: function (e) {
    var that = this;
    var userName = wx.getStorageSync("userInfo").userName;
    // 获取封面路径
    var courseImg = that.data.courseImg;
    // 获取表单数据
    let courseName = that.data.courseName;
    if (courseName == null || courseName == "") {
      wx.showToast({
        title: '课程名称不能为空...',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 确定保存
      wx.showModal({
        title: '提示',
        content: '是否创建？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            // 创建课程
            wx.showLoading({
              title: '课程创建中...',
            })
            db.collection('resources').add({
              data: {
                courseName: courseName,
                courseImg: courseImg,
                publisher: userName || '王老师',
                releaseTime: util.formatTime(new Date(), 'YY-MM-DD hh-mm-ss'),
                teachingMaterials: [],
                referenceMaterials: [],
                videoMaterials: []
              },
              success(res) {
                wx.hideLoading();
                that.setData({
                  courseId: res._id
                })
                wx.showToast({
                  title: '课程创建成功',
                  icon: 'success',
                  success() {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../home/index',
                      })
                    }, 1500)
                    that.setData({
                      courseName: '',
                      courseImg: "../../assets/images/icon/add2.png",
                    })
                  }
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  // 重置
  reset() {
    this.setData({
      courseName: '',
      courseImg: "../../assets/images/icon/add2.png",
    })
  }
})

