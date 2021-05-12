// miniprogram/pages/cours/index.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '79550af2609b4edd16246a2e061b0378',
    courseInfo: [],
    fileList: [],
    teachingMaterials: [],  // 教材资料
    referenceMaterials: [],  // 参考资料
    videoMaterials: [],  // 视频资料
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let courseId = options.courseId;
    // this.setData({
    //   courseId: courseId
    // })
    this.getCourseInfo(this.data.courseId);
  },

  getCourseInfo(courseId) {
    var that = this;
    db.collection('resources').where({
      _id: that.data.courseId
    })
      .get({
        success(res) {
          console.log("courseInfo: ", res.data);
          that.setData({
            courseInfo: res.data[0]
          })
        }
      })
  },

  // 文件上传
  afterRead(e) {
    let that = this;
    wx.showLoading({
      title: '资料上传中...',
    })
    let t_Materials = [];
    let fileDetails = e.detail.file;
    wx.cloud.uploadFile({
      cloudPath: "course_from/" + e.detail.file.name,
      filePath: e.detail.file.url,
      success:res => {
        console.log("上传成功" , res);        
        t_Materials.push(res.fileID);
        that.setData({
          teachingMaterials: t_Materials
        })
        that.addTeachingMaterials(that.data.teachingMaterials);
      }
    })
  },

  // 添加资料到该课程中
  addTeachingMaterials(teachingMaterials) {
    let that = this;
    wx.cloud.callFunction({
      name: 'uploadFiles',
      data: {
        courseId: that.data.courseId,
        teachingMaterials: teachingMaterials
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: '资料上传成功',
        })
      }
    })
  },

  // 获取教学教材列表
  getTeachingMaterials() {

  }
})