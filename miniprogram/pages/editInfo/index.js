// miniprogram/pages/editInfo/index.js
const app = getApp()
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
    var that = this;
    
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

    var userInfo = wx.getStorageSync("userInfo");
    console.log(email)
    if (username == "" || email == "" || number == "" || telephone == "" || password == "") {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none'
      })
      return false
    }
    else {
      wx.showLoading({
        title: '请稍后...',
      })
      wx.request({

        url: app.serverurl + 'user/updatauserbyid?userId=' + userInfo.userId,
        method: 'POST',
        data: {
          username: username,
          email: email,
          number: number,
          telephone: telephone,
          email: email,
          password: password
        },
        success: function (res) {
          wx.hideLoading();
          var status = res.data.status;
          console.log(status);
          if (status == 200) {
            wx.showToast({
              title: "修改成功",
              icon: 'none',
              success(ress) {

                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/home/index',
                  })
                }, 1500)
              }
            })


          } else if (status == 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
})