let app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    //假设数据
    index: 0, //当前题目
    sum: 0, //总分
    ans_id: [ //用于显示ABCD
      "A", "B", "C", "D", "E", "F", "G"
    ],
    myBlank_id: [ //用于显示
      "第一空", "第二空", "第三空", "第四空", "第五空", "第六空", "第七空"
    ],
    checked: [], //用于显示做过题目的选中
    type: [ //用于显示
      "单选题", "多选题", "填空题"
    ], //阿展的数据
    taskinfo: {},
    questionList: [],
    homeworkId: '',
  },
  do: function (e) {
  },

  onLoad: function (e) {
    let that = this;
    that.setData({
      homeworkId: e.homeworkId
    })
    db.collection('works').doc(e.homeworkId).get({
      success: res => {
        console.log(res.data.questionList);
        let quslist = res.data.questionList;
        let questionlist = [];
        that.setData({
          questionList: quslist,
          taskinfo: res.data,
        })
        for (let index in quslist) {
          let type = quslist[index].questionType;
          if (type === 3) {
            var question = {
              questionType: quslist[index].questionType,
              questionID: quslist[index].questionId,
              questionDesc: quslist[index].questionDesc,
              choicelist: [],
              answer: quslist[index].choicelist, //answer[i]
              useranswer: [],
              grade: -1
            }
          } else {
            let choice = quslist[index].choice.split('-');
            let choicelist = []
            choice.map(item => {
              choicelist.push(item.split('.')[1])
            })
            var question = {
              questionType: quslist[index].questionType,
              questionID: quslist[index].questionId,
              questionDesc: quslist[index].questionDesc,
              choicelist: choicelist,
              answer: quslist[index].answer, //answer[i]
              useranswer: [],
              grade: -1
            }
            console.log("question: " , question);
          }
          questionlist.push(question);
          console.log(questionlist);
        }
        that.setData({
          questionList: questionlist
        })
      }
    })

    // 根据前端页面假设，设置作业名为导航条名
    var taskTitle = that.data.taskinfo.taskTitle
    wx.setNavigationBarTitle({
      title: taskTitle,
    })

    // 将未作的题目的得分grade设置为-1
    var questionlist2 = that.data.questionList
    for (let i = 0; i < that.data.questionList.length; i++) {
      questionlist2[i].grade = -1,
      questionlist2[i].useranswer = []
    }
    that.setData({
      questionList: questionlist2
    })
  },

  // 检查输入是否为空
  checkBlank: function (e) {
    var type = this.data.questionList[this.data.index].questionType;
    var that = this.data.questionList[this.data.index];
    if (type == 1) {
      if (e.detail.value.single === "") {
        return false
      }
    } else if (type == 2) {
      if (e.detail.value.multi == "") {
        return false
      }
    } else if (type == 3) {
      for (var i = 0; i < that.answer.length; i++) {
        if (e.detail.value[i].length == 0)
          return false
      }
    }
    return true
  },

  // 上一题
  toPre(e) {
    var currentIndex = this.data.index;
    this.setData({
      index: currentIndex - 1,
      checked: []
    })
    this.setchecked()
  },

  // 下一题
  toNext(e) {
    var currentIndex = this.data.index
    this.setData({
      index: currentIndex + 1,
      checked: []
    })
    this.setchecked()
  },

  // 保存答案并计算grade个题得分
  saveans: function (e) {
    var type = this.data.questionList[this.data.index].questionType;
    var that = this.data.questionList;
    if (type === 1) {
      console.log(that);
      that[this.data.index].useranswer[0] = e.detail.value.single;
      if (that[this.data.index].useranswer[0] == that[this.data.index].answer[0]) {
        that[this.data.index].grade = (100 / that.length).toPrecision(3);
      } else {
        that[this.data.index].grade = 0;
      }
    } else if (type == 2) {
      var t = e.detail.value.multi;
      t = t.sort();
      console.log(that);
      that[this.data.index].useranswer[0] = '';
      for (var i = 0; i < t.length; i++) {
        that[this.data.index].useranswer[0] += t[i];
      }
      if (that[this.data.index].useranswer[0] == that[this.data.index].answer) {
        that[this.data.index].grade = (100 / that.length).toPrecision(3);
      } else {
        that[this.data.index].grade = 0;
      }
    } else if (type == 3) {
      console.log(that);
      var length = this.data.questionList[this.data.index].answer.length;
      for (var i = 0; i < length; i++) {
        that[this.data.index].useranswer[i] = '';
        that[this.data.index].useranswer[i] += e.detail.value[i];
        if (that[this.data.index].useranswer[i] == that[this.data.index].answer[i]) {
          that[this.data.index].grade = (100 / that.length).toPrecision(3);
        } else {
          that[this.data.index].grade = 0;
        }
      }
    }
    this.setData({
      questionList: that
    })
  },

  // 提交事件
  submit: function (e) {
    var that = this
    if (e.detail.target.id == 2) {
      if (this.checkBlank(e)) {
        // 如果是下一页，保存当前页答案计算分数后跳转下页
        this.saveans(e);
        this.toNext(e);
      } else {
        wx.showToast({
          title: '请填写答案',
          icon: "none"
        })
      }
    } else if (e.detail.target.id == 1) {
      // 如果是上一页，不保存当前页答案跳转上页
      this.toPre(e);
    } else {
      // 如果是最后一页的提交检查不为空后保存并提交
      if (this.checkBlank(e)) {
        this.saveans(e);
        wx.showModal({
          title: '提示',
          content: '确认提交后无法修改',
          success: function (res) {
            if (res.confirm) {
              // 计算总分
              var sum = 0;
              for (var i = 0; i < that.data.questionList.length; i++) {
                sum += that.data.questionList[i].grade * 1;
              }
              sum = (sum * 1).toPrecision(3);
              that.setData({
                sum: sum
              })
              console.log('题目', that.data.questionList);
              // 加工函数
              var myans = '';
              var temp = '';
              for (var i = 0; i < that.data.questionList.length; i++) {
                if (that.data.questionList[i].questionType != 3)
                  myans += that.data.questionList[i].useranswer[0];
                else {
                  temp = '';
                  for (var j = 0; j < that.data.questionList[i].useranswer.length; j++) {
                    temp += that.data.questionList[i].useranswer[j];
                    if (j != that.data.questionList[i].useranswer.length - 1)
                      temp += ',';
                  }
                  myans += temp;
                }
                if (i != that.data.questionList.length - 1) {
                  myans += '-';
                }
              }
              // (待修改)数据提交后跳转分数查看页面
              console.log('总分', that.data.sum);
              console.log(myans);

              var taskin = that.data.taskinfo;
              var courseTaskId = taskin.courseTaskId;
              var userinfo = wx.getStorageSync("userInfo");
              var userId = userinfo.userId;
              var sums = that.data.sum;
              var useranswer = myans;

              db.collection('questions').add({
                data: {
                  useranswer: useranswer,
                  sums: sums,
                  userId: userId,
                  courseTaskId: courseTaskId,
                  questionId: that.data.homeworkId
                },
                success: function(res) {
                  console.log(res)
                  setTimeout(() => {
                    wx.showModal({
                      title: '作业成绩',
                      content: '本次成绩为：' +  that.data.sum + '，答案为：' + myans,
                      success (res) {
                        wx.navigateBack()
                      }
                    })
                  } , 1500)
                }
              })

              wx.showToast({
                title: '提交成功',
                duration: 1500
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '请填写答案',
          icon: "none"
        })
      }
    }
  },

  // 设置默认选中
  setchecked: function () {
    var type = this.data.questionList[this.data.index].questionType;
    var that = this.data.questionList[this.data.index];
    var ans = that.useranswer[0];

    var check = this.data.checked;
    check = [];
    if (type != 3 && that.useranswer.length != 0) {
      for (var i = 0; i < ans.length; i++) {
        switch (ans.charAt(i)) {
          case "A":
            check[0] = 'true';
            break;
          case "B":
            check[1] = 'true';
            break;
          case "C":
            check[2] = 'true';
            break;
          case "D":
            check[3] = 'true';
            break;
          case "E":
            check[4] = 'true';
            break;
          case "F":
            check[5] = 'true';
            break;
          case "G":
            check[6] = 'true';
            break;
        }
      }

      this.setData({
        checked: check
      })
    }
  },
})