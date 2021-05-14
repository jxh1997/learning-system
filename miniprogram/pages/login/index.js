//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    username: '',
    password: '',
    code: '',
    makecode: '',
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    wx.hideTabBar({})
  },

  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onReady: function () {
    this.createCode();
  },
  getcode: function () {
    this.createCode();
  },


  // 获取输入账号 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 获取输入验证码
  makecodeInput: function (e) {
    this.setData({
      makecode: e.detail.value
    })
  },

  // 登录处理
  login: function () {
    var that = this;
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '账号或密码不能为空',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        username: '',
        password: ''
      })
      this.createCode();
    } else if(this.data.makecode.length == 0 ){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        makecode: ''
      })
      this.createCode();
    } else if(this.data.makecode !== this.data.code ){
      wx.showToast({
        title: '验证码错误，请重新输入',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        makecode: ''
      })
      this.createCode();
    } else {
      db.collection('users').where({
        userid: that.data.username,
        password: that.data.password,
      }).get({
        success: res => {
          console.log(res);
          if(res.data.length !== 0) {
            let userInfo = res.data[0];
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('userInfo', userInfo);
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.switchTab({ 
                url: '../home/index'
              })
            } , 1500)
          } else if(res.data.length === 0) {
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'none',
              duration: 2000
            })

          }
        }
      })
    }
  },
  // 获取验证码
  createCode() {
    var code;
    //首先默认code为空字符串
    code = '';
    //设置长度，这里看需求，我这里设置了4
    var codeLength = 4;
    //设置随机字符
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    //循环codeLength 我设置的4就是循环4次
    for (var i = 0; i < codeLength; i++) {
      //设置随机数范围,这设置为0 ~ 10
      var index = Math.floor(Math.random() * 10);
      //字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    }
    //将拼接好的字符串赋值给展示的code
    this.setData({
      code: code
    })
  },

  // 注册
  gotoRegister() {
    wx.navigateTo({
      url: '../register/index',
    })
  }
})
