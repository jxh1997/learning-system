// miniprogram/pages/createWorks/wkCreate/index.js
const db = wx.cloud.database();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    courseObj: [],
    courseId: '',
    index: 0,
    worksTitle: '',
    worksContent: '',
    worksDesc: '',
    score: 100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllCourses()
  },

  // 获取所有课程信息
  getAllCourses() {
    var that = this;
    db.collection('resources')
      .get({
        success(res) {
          let course = [];
          res.data.map(item => {
            course.push(item.courseName)
          })
          let courseId = res.data[0]._id;
          that.setData({
            courseList: course,
            courseObj: res.data,
            courseId: courseId
          })
        }
      })
  },

  // 当前课程选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let courseId = this.data.courseObj[e.detail.value]._id;
    this.setData({
      index: e.detail.value,
      courseId: courseId,
    })
  },

  // 作业标题
  bindKeyInput(e) {
    this.setData({
      worksTitle: e.detail.value
    })
  },

  // 作业内容
  bindTextareaInput(e) {
    this.setData({
      worksContent: e.detail.value
    })
  },

  // 获取备注内容
  bindTextareaInputBz(e) {
    this.setData({
      worksDesc: e.detail.value
    })
  },

  // 检查作业填写内容
  saveWorks() {
    var that = this;
    if (that.data.worksTitle === '') {
      wx.showToast({
        title: '请填写作业标题',
        icon: 'none'
      })
      return
    }
    if (that.data.worksContent === '') {
      wx.showToast({
        title: '请输入作业内容',
        icon: 'none'
      })
      return
    } else {
      that.publishHomework()
    }
  },

  // 保存作业
  publishHomework() {
    var that = this;
    db.collection('works2').add({
      data: {
        courseId: that.data.courseId,
        worksTitle: that.data.worksTitle,
        worksContent: that.data.worksContent,
        worksDesc: that.data.worksDesc,
        createTime: util.formatTime(new Date()),
        score: that.data.score,
        status: 0,

      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '发布成功！',
          icon: 'success'
        })
        setTimeout(() => {
          wx.navigateBack({})
        } , 1500)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  // 作业内容重置
  resetWorks() {
    this.setData({
      index: 0,
      worksTitle: '',
      worksContent: '',
      worksDesc: '',
    })
  },

})