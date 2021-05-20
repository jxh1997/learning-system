const app = getApp()
const db = wx.cloud.database();
var util = require('../../../utils/util.js');

// pages/course/component_t/experiment/ex_show/ex_show.js
Page({
  data: {
    wokdsid: '',
    worksList: {},
    worksTj: '',
    score: 0,
    type: [""],//文件格式
    experimentInfo:"",
    urllist:[],
    success:false,
    //(待修改)从上个实验中获取实验详情，涉及到json的转换
    exList: "",//实验
  },

  open: function (e) {
    var me = this;
    var arrindex = e.currentTarget.dataset.index;
    var url = this.data.urllist[arrindex].url;
    var fileType = this.data.urllist[arrindex].type;
    if (fileType=="docx"){
      fileType = "doc"
    } else if (fileType == "pptx"){
      fileType = "ppt"
    }
    console.log(fileType)
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: fileType,
          success: function (res) {
            console.log('打开文档成功')
            console.log(filePath)
          },
          fail:function(){
            wx.showToast({
              title: '格式有误，无法打开...',
              icon: 'none'
            })
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var wokdsid = options.wokdsid;
    this.setData({
      wokdsid: wokdsid
    })
    let that = this;
    db.collection('works2').doc(wokdsid).get({
      success: res => {
        console.log(res);
        that.setData({
          worksList: res.data
        })
      }
    })
    // me.getAllCourseList();
  },

  // 作业填写
  bindInputWorks(e) {
    this.setData({
      worksTj: e.detail.value
    })
  },
  
  // 提交作业
  publishHomework() {
    var that = this;
    db.collection('worksFinish').add({
      data: {
        works: that.data.worksList,
        worksAnswer: that.data.worksTj,
        submitTime: util.formatTime(new Date()),
        score: 0,
        status: 1,
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '作业提交成功！',
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
      worksTj: '',
    })
  },

})