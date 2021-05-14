//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    username: '',
    name: '',
    password: '',
    password2: '',
    grade: 2,  // 权限， 1 教师  2 学生
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
  // 获取输入账号 
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 获取输入密码 
  password2Input: function (e) {
    this.setData({
      password2: e.detail.value
    })
  },
  
  // 身份确认
  switch1Change(e) {
    if(e.detail.value) {
      this.setData({
        grade: 1
      })
    } else {
      this.setData({
        grade: 2
      })
    }
  },

  // 获取输入验证码
  makecodeInput: function (e) {
    this.setData({
      makecode: e.detail.value
    })
  },

  // 注册处理
  register: function () {
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
    } else if(this.data.password !== this.data.password2) {
      console.log(this.data);
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 2000
      })
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
      db.collection('users').add({
        data: {
          userid: that.data.username,
          username: that.data.name,
          password: that.data.password,
          grade: that.data.grade,
        },
        success: res => {
          console.log(res);
          if(res.errMsg == 'collection.add:ok') {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '../login/index',
              })
            } , 1500)
          } else {
            wx.showToast({
              title: '注册失败 稍后重试',
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

  // 登录
  gotoLogin() {
    wx.navigateTo({
      url: '../login/index',
    })
  }
})
