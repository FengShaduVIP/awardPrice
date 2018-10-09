//index.js 
var call = require("../../utils/request.js")
//获取应用实例
var app = getApp()
Page({
  data: {
    circleList: [],//圆点数组
    awardList: [],//奖品数组
    isCanSelect:false,//是否可以点击抽奖按钮
    awardNum:5,//抽奖号码
    phoneNum:null,//输入的手机号
    showModalStatus: true,//是否显示弹窗
    colorCircleFirst: '#FFDF2F',//圆点颜色1
    colorCircleSecond: '#FE4D32',//圆点颜色2
    colorAwardDefault: '#F5F0FC',//奖品默认颜色
    colorAwardSelect: '#ffe400',//奖品选中颜色
    indexSelect: null,//被选中的奖品index
    isRunning: false,//是否正在抽奖
    textList:[
      '<p><li><strong>奖品一 </strong> : iPhone8 plus 256G</li></p>',
      '<p><li><strong>奖品二 </strong> : 美图v6手机</li></p>',
      '<p><li><strong>奖品三 </strong> : AJ黑金正版鞋</li></p>',
      '<p><li><strong>奖品四 </strong> : 加强版refa</li></p>',
      '<p><li><strong>奖品五 </strong> : 888现金红包</li></p>',
      '<p><li><strong>奖品六 </strong> : coco 香水</li></p>',
      '<p><li><strong>奖品七 </strong> : 520现金红包</li></p>',
      '<p><li><strong>奖品八 </strong> : mac 口红</li></p>',
    ],
    imageAward: [
      '../../images/1.png',
      '../../images/2.jpg',
      '../../images/3.jpg',
      '../../images/4.jpg',
      '../../images/5.jpg',
      '../../images/6.jpg',
      '../../images/7.jpg',
      '../../images/8.jpg',
    ],//奖品图片数组
  },
  initCircleData :function(){
    var _this = this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      circleList: circleList
    })
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#fb9e01') {
        _this.setData({
          colorCircleFirst: '#ffffff',
          colorCircleSecond: '#fb9e01',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#fb9e01',
          colorCircleSecond: '#ffffff',
        })
      }
    }, 500)//设置圆点闪烁的效果
  },
  initAwardListData:function(){
    var _this = this;
    //奖品item设置
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      var imageAward = this.data.imageAward[j];
      awardList.push({index:j, topAward: topAward, leftAward: leftAward, imageAward: imageAward });
    }
    this.setData({
      awardList: awardList
    })
  },
  onLoad: function () {
    //设置圆点数据
    this.initCircleData();
    this.initAwardListData();   
  },
  //设置手机号码
  setAwardNum: function (e) {
    this.data.phoneNum = e.detail.value;
  },
  //开始抽奖
  startGame: function () {
    var _this = this;
    if (!_this.data.isCanSelect){
      wx.showModal({
        content:"未填写抽奖号码不能进行抽奖！",
        showCancel: false,//去掉取消按钮
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              isCanSelect: false
            })
            wx.navigateBack({
              delta: -1
            })
          }
        }
      })
      return;
    }
    if (this.data.isRunning) return
    this.setData({
      isRunning: true
    })
    var indexSelect = 1;
    var i = 0;
    var randomNum = parseInt(Math.random() * 10, 10);
    var awardNum = (randomNum>4)?5:3
    this.setData({
      awardNum: awardNum
    })
    var maxNun = (randomNum+1)*8;
    console.log("maxNun", maxNun);
    var timer = setInterval(function () {
      indexSelect++;
      i += 1;
      if (i > (maxNun+ _this.data.awardNum)) {
        //去除循环
        clearInterval(timer)
        //获奖提示
        wx.showModal({
          title: '恭喜您',
          content: '获得了第' + (_this.data.awardList[indexSelect].index+1) + "个奖品",
          showCancel: false,//去掉取消按钮
          success: function (res) {
            if (res.confirm) {
              _this.setData({
                isRunning: false
              })
            }
          }
        })
      }
      indexSelect = indexSelect % 8;
      _this.setData({
        indexSelect: indexSelect,
        isCanSelect: false
      })
    }, (200 + i));
  },
  powerDrawer: function (e) {
    var _this = this;
    var phoneNum = this.data.phoneNum;
    //检验手机号码是否为空
    if (phoneNum==null){
      wx.showModal({
        content: "未填写抽奖号码不能进行抽奖！",
        showCancel: false,//去掉取消按钮
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              isCanSelect: false
            })
          }
        }
      })
      return;
    }
    this.checkPhoneNum(e);
    
    
  }, 
  //弹窗部分 代码
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;
    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false,
            isCanSelect:true
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  checkPhoneNum:function(e){
    var phoneNum = this.data.phoneNum;
    call.getData('webpublic/checkAwardTimes?phoneNum=' + phoneNum, this.doAwardAction, this.fail);
  },
  doAwardAction: function (data){
    var _this = this;
    console.log("data",data)
    if (data.data) {
      var currentStatu ='close';
      _this.setData({
        showModalStatus: false,//是否显示弹窗
        isCanSelect:true
      })
    } else {
      wx.showModal({
        content: "该抽奖号码不能进行抽奖！",
        showCancel: false,//去掉取消按钮
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              isCanSelect: false
            })
          }
        }
      })
      return;
    }
  },
  fail :function(){

  }

})
