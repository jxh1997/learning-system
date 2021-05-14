// pages/my/mes/mes.js
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mess:[
      // {
      //   img:"../../../img/my.png",
      //   name:"炸老师",
      //   con:"怎么还不来上课?你已经没来10次了",
      //   time:"2019/4/3"
      // },
      // {
      //   img: "../../../img/home.png",
      //   name: "谢老师",
      //   con: "同学好几次没来了，考试得考100分才能过呀",
      //   time: "2019/4/1"
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAllNews()
  },

  getAllNews() {
    db.collection('interaction').get({
      success: res => {
        console.log(res);
      }
    })
  }

})