// miniprogram/pages/cours/index.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: 2,
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
    this.setData({
      courseId: courseId,
      grade: app.globalData.userInfo.grade
    })
    this.getCourseInfo(this.data.courseId);
  },

  // 获取课程信息
  getCourseInfo(courseId) {
    var that = this;
    db.collection('resources').where({
      _id: that.data.courseId
    })
      .get({
        success(res) {
          console.log("courseInfo: ", res.data);
          that.setData({
            courseInfo: res.data[0],
            teachingMaterials: res.data[0].teachingMaterials,
            referenceMaterials: res.data[0].referenceMaterials,
            videoMaterials: res.data[0].videoMaterials
          })
          that.setMaterials()
        }
      })
  },

  // 文件上传
  afterRead(e) {
    let type = e.currentTarget.dataset.type;
    let that = this;
    wx.showLoading({
      title: '资料上传中...',
    })
    let Materials = [];
    if (type === 'Teaching') {
      Materials = that.data.courseInfo.teachingMaterials;
    } else if (type === 'Reference') {
      Materials = that.data.courseInfo.referenceMaterials;
    } else if (type === 'Video') {
      Materials = that.data.courseInfo.videoMaterials;
    }
    console.log(e.detail);
    wx.cloud.uploadFile({
      cloudPath: "course_from/" + e.detail.file.name,
      filePath: e.detail.file.url,
      success: res => {
        console.log("上传成功", res);
        let fileID = res.fileID;
        let fileName = fileID.split('/')[4];
        let fileHouzhui = fileName.split('.')[1];
        let Materials_obj = {
          fileID: fileID,
          fileName: fileName,
          fileHouzhui: fileHouzhui
        }
        Materials.push(Materials_obj);
        if (type === 'Teaching') {
          that.setData({
            teachingMaterials: Materials
          })
          that.addMaterials('Teaching', that.data.teachingMaterials);
        } else if (type === 'Reference') {
          that.setData({
            referenceMaterials: Materials
          })
          that.addMaterials('Reference', that.data.referenceMaterials);
        } else if (type === 'Video') {
          that.setData({
            videoMaterials: Materials
          })
          that.addMaterials('Video', that.data.videoMaterials);
        }
        // that.setMaterials();
      }
    })
  },

  // 视频图片上传
  afterReadVideo(e) {
    let that = this;
    wx.showLoading({
      title: '视频文件上传中...',
    })
    let Materials = [];
    Materials = that.data.courseInfo.videoMaterials;
    let sjc = (new Date()/1000).toString();
    let videoName = that.data.courseInfo.courseName + sjc.split('.')[0] + '.mp4';
    console.log(videoName);
    wx.cloud.uploadFile({
      cloudPath: "course_from/" + videoName,
      filePath: e.detail.file.url,
      success: res => {
        console.log("上传成功", res);
        let fileID = res.fileID;
        let fileName = fileID.split('/')[4];
        let fileHouzhui = fileName.split('.')[1];
        let Materials_obj = {
          fileID: fileID,
          fileName: fileName,
          fileHouzhui: fileHouzhui
        }
        Materials.push(Materials_obj);
        that.setData({
          videoMaterials: Materials
        })
        that.addMaterials('Video', that.data.videoMaterials);
      }
    })
  },

  // 视频播放
  playVideo(e) {
    let fileId = e.currentTarget.dataset.fileid;
    wx.navigateTo({
      url: '../playVideo/index?fileId=' + fileId
    })
  },

  // 添加资料到该课程中
  addMaterials(type, materials) {
    let that = this;
    wx.cloud.callFunction({
      name: 'uploadFiles',
      data: {
        courseId: that.data.courseId,
        type: type,
        materials: materials
      },
      success: res => {
        wx.showToast({
          title: '内容上传成功',
        })
      }
    })
  },

  // 资料信息处理
  setMaterials() {
    let that = this;
    let tea_Materials = [];
    console.log(tea_Materials);
    this.data.teachingMaterials.map((item, index) => {
      let fileID = item;
      let fileName = item.split('/')[4];
      let fileHouzhui = fileName.split('.')[1];
      let file = {
        fileID: fileID,
        fileName: fileName,
        fileHouzhui: fileHouzhui
      }
      tea_Materials.push(file);
      console.log(tea_Materials);

    })
    that.setData({
      teachingMaterials: tea_Materials
    })
  },

  // 文件预览打开
  openFile(e) {
    let fileId = e.currentTarget.dataset.fileid;
    let fileUrl = '';
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        // res.fileList[0].tempFileURL是https格式的路径，可以根据这个路径在浏览器上下载
        fileUrl = res.fileList[0].tempFileURL;
        //根据https路径可以获得http格式的路径(指定文件下载后存储的路径 (本地路径)),根据这个路径可以预览
        wx.downloadFile({
          url: fileUrl,
          success: res => {
            let httpFileUrl = res.tempFilePath;
            // 预览文件
            wx.openDocument({
              filePath: httpFileUrl,
              success: res => {
                console.log(res);
              },
              fail: err => {
                console.log(err);
              }
            })
          }
        })
      }
    })
  },

  // 文件下载
  downLoadFile(e) {
    let fileId = e.currentTarget.dataset.fileid;
    let fileUrl = '';
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        wx.showLoading({
          title: '文件下载中...',
        })
        fileUrl = res.fileList[0].tempFileURL;
        wx.downloadFile({
          url: fileUrl,
          success: res => {
            let httpFileUrl = res.tempFilePath;
            // 下载文件
            wx.saveFile({
              tempFilePath: httpFileUrl,
              success: res => {
                wx.showToast({
                  title: '文件下载成功',
                  icon: 'success'
                })
              },
              fail: err => {
                wx.showToast({
                  title: '文件下载失败',
                  icon: 'none'
                })
              }
            })
          }
        })
      }
    })
  },

  // 文件删除
  delFile(e) {
    let type = e.currentTarget.dataset.type;
    let fileId = e.currentTarget.dataset.fileid;
    let that = this;
    let Materials_del = [];
    if (type === 'Teaching') {
      that.data.teachingMaterials.map((item, index) => {
        if (item.fileID === fileId) {
          return;
        } else {
          Materials_del.push(item);
        }
      })
    } else if (type === 'Reference') {
      that.data.referenceMaterials.map((item, index) => {
        if (item.fileID === fileId) {
          return;
        } else {
          Materials_del.push(item);
        }
      })
    } else if (type === 'Video') {
      that.data.videoMaterials.map((item, index) => {
        if (item.fileID === fileId) {
          return;
        } else {
          Materials_del.push(item);
        }
      })
    }

    wx.cloud.callFunction({
      name: 'uploadFiles',
      data: {
        courseId: that.data.courseId,
        type: type,
        materials: Materials_del
      },
      success: res => {
        if (type === 'Teaching') {
          that.setData({
            teachingMaterials: Materials_del
          })
        } else if (type === 'Reference') {
          that.setData({
            referenceMaterials: Materials_del
          })
        } else if (type === 'Video') {
          that.setData({
            videoMaterials: Materials_del
          })
        }
        wx.showToast({
          title: '资料删除成功',
        })
        that.getCourseInfo();
      },
      fail: err => {
        wx.showToast({
          title: '资料删除失败',
        })
      }
    })
  }
})