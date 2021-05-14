// miniprogram/pages/editInfo/index.js
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },

  // 确认修改提交
  submituser: function (e) {
    console.log(e);
    var formObject = e.detail.value;
    var username = formObject.username;
    var userid = formObject.userid;
    var tel = formObject.tel;
    var sex = formObject.sex;
    var password = formObject.password;
    var userInfo = this.data.userInfo;
    console.log(userInfo)
    if (username == "" || userid == "" || tel == "" || sex == "" || password == "") {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none'
      })
      return false
    }
    else {
      wx.showLoading({
        title: '修改中,请稍后...',
      })
      db.collection('users').doc(userInfo._id).update({
        data: {
          username: formObject.username,
          tel: formObject.tel,
          sex: formObject.sex,
          password: formObject.password,
        },
        success: res => {
          wx.showToast({
            title: "修改成功",
            icon: 'success',
            success: res => {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500)
            }
          })
        }
      })
    }
  }
})