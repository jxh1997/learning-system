const app = getApp()
var util = require('../../utils/util.js');
const db = wx.cloud.database();

Component({
  data: {
    date: "",
    txtStyle: "",
    hw_count:1,
    showModal: false,
    currentBlock:0,
    totalPublishedTasks: 0,
    totalUnpublishTasks: 0,
    courseId: "424245",
    delBtnWidth: 90,//删除按钮宽度单位（rpx）
    publishedList: [],
    unpublishList: [],
    serverUrl: ""
  },
  pageLifetimes:{
    show() {
      this.setData({
        currentBlock: 0
      })
      var that = this;
      that.getAllPublishedTasks();
      
      console.log("显示主页面。。。");
    },
    hide(){
      console.log("主页面隐藏。。。");
    }
  },

  methods: {
    //已提交作业详情
    showPHW: function (e) {
      var name = this.data.publishedList[e.currentTarget.dataset.set].title
      var courseTaskId = this.data.publishedList[e.currentTarget.dataset.set].courseTaskId
      wx.navigateTo({
        url: '/pages/course/component_t/homework/phw_show/phw_show?name=' + name + "&" + "index=" + e.currentTarget.dataset.set + "&courseTaskId=" + courseTaskId,
      })
    },

    push: function (e) {
      console.log(123)
    },
    touchS: function (e) {
      if (e.touches.length == 1) {
        this.setData({
          //设置触摸起始点水平方向位置
          startX: e.touches[0].clientX
        });
      }
    },
    touchM: function (e) {
      if (e.touches.length == 1) {
        //手指移动时水平方向位置
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        var txtStyle = "";
        if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0px";
        } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-" + disX + "px";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-" + delBtnWidth + "px";
          }
        }
        //获取手指触摸的是哪一项
        var index = e.target.dataset.index;
        var list = this.data.unpublishList;
        if (index == null) {
          return false
        }
        list[index].txtStyle = txtStyle

        //更新列表的状态
        this.setData({
          unpublishList: list
        });
      }
    },
    touchE: function (e) {
      if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
        //获取手指触摸的是哪一项
        var index = e.target.dataset.index;
        var list = this.data.unpublishList;

        if (index == null) {
          return false
        }

        //更新列表的状态
        this.setData({
          unpublishList: list
        });
      }
    },
    // 获取元素自适应后的实际宽度
    getEleWidth: function (w) {
      var real = 0;
      try {
        var res = wx.getSystemInfoSync().windowWidth;
        var scale = (750 / 2) / (w / 2);
        // console.log(scale);
        real = Math.floor(res / scale);
        return real;
      } catch (e) {
        return false;
        // Do something when catch error
      }
    },
    initEleWidth: function () {
      var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
      this.setData({
        delBtnWidth: delBtnWidth
      });
    },

    // 展示课后作业
    showHW: function (e) {
      // var courseId = app.getGlobalMyCourseInfo().courseId;
      var homeworkId = e.currentTarget.dataset.set;
      console.log(homeworkId);
      wx.navigateTo({
        url: '../question/exam/index?homeworkId=' + homeworkId,
      }) 
    },

    //点击删除按钮事件
    delItem: function (e) {
      //获取列表中要删除项的下标
      var that = this;
      var unpublishList = this.data.unpublishList;
      var index = e.target.dataset.index;
      var task = unpublishList[index];
      console.log(task.courseTaskId);
      //移除列表中下标为index的项
      wx.showModal({
        title: '提示',
        content: '确定要删除' + unpublishList[index].title + "吗？",
        success(res) {
          if (res.confirm) {
            var serverUrl = app.serverUrl;
            wx.request({
              url: serverUrl + '/task/removeTask?courseTaskId=' + task.courseTaskId,
              method: "POST",
              success: function (res) {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
                console.log(res.data);

                if (res.data.status == 200){
                  //删除
                  unpublishList.splice(index, 1);
                  //更新列表的状态
                  that.setData({
                    unpublishList: unpublishList
                  });
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: '删除失败',
                    icon: "none"
                  });
                }
              },fail:function(){
                wx.showToast({
                  title: '网络请求超时!~~',
                  icon: "none"
                });
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    // 获取所有作业信息
    getAllPublishedTasks: function () {
      var that = this;
      wx.showLoading({
        title: '请等待，加载中...',
      });
      db.collection('works').get({
        success(res) {
          wx.hideLoading();
          console.log("courseList: " , res);
          that.setData({
            publishedList: res.data,
            totalPublishedTasks: res.data.length
          })
          // that.getUserFinshed(res.data);
        },fail(err) {
          console.log(err);
        }
      })
    },

    // 获取用户是否完成该作业
    getUserFinshed(courseList) {
      var that = this;
      db.collection('questions').where({
        _openid: app.globalData.openid
      }).get({
        success(res) {
          let questions = res.data;
          for(let i = 0 ; i < questions.length; i++) {
            for(let j = 0 ; j < courseList.length; j++) {
              if(questions[i].questionId === courseList[j]._id) {
                console.log("123",courseList[j]);
              }
            }
          }
          // that.setData({
          //   publishedList: res.data,
          //   totalPublishedTasks: res.data.length
          // })
        },fail(err) {
          console.log(err);
        }
      })
    },

    // 去发布
    toAdd:function(){
      let that = this;
      wx.navigateTo({
        url: './hwCreate/index?name=' + that.data.date,
      })
    },

    // 是否发布
    changeFlag: function () {
      if (this.data.currentBlock == 0) {
        this.setData({
          currentBlock: 1
        })
      }
      else {
        this.setData({
          currentBlock: 0
        })
      }
    },

    toExams: function () {
      wx.navigateTo({
        url: '/pages/course/component/question/exam/exam',
      })
    },

    // 显示弹出按钮
    showDialogBtn: function () {
      var time = util.formatTime(new Date());
      this.setData({
        date: time + " 作业" + this.data.hw_count
      })
      this.setData({
        showModal: true
      })
    },

    /**
    * 隐藏模态对话框
    */
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
    /**
    * 对话框取消按钮点击事件
    */
    onCancel: function () {
      this.hideModal();
    },
    /**
    * 对话框确认按钮点击事件
    */
    GetName: function (e) {
      var name = e.detail.value.hw_name//获取作业名

      this.hideModal();
      this.setData({
        hw_count: this.data.hw_count + 1
      })
      wx.navigateTo({
        url: '/pages/course/component_t/homework/hw_create/hw_create?name=' + name,
      })
    }
  },
})