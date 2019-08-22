// pages/input/inputbg/inputbg.js
var util = require("../../../../utils/util.js");
import {
  vicoBloodGlucoseCommit,
  vicoBloodGlucoseDelete
} from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    measureDateTime: "",
    bloodGlucose: "",
    // additionMarkType:"",
    // additionMark: "",
    // type:0,
    timePoint:"",
    memo: "",
    serialNo: 0,
    status: 0,
    event: {},
    
    markArr:[{type:1,name:"晨起空腹"},{type:2,name:"早餐后"},{type:3,name:"午餐前"},
    {type:4,name:"午餐后"},{type:5,name:"晚餐前"},{type:6,name:"晚餐后"},
    {type:7,name:"睡前"},{type:8,name:"凌晨"}],
    // markArr:[{type:0 , name:"早餐前" ,addition:"餐前"},{type:0 , name:"早餐后" ,addition:"餐后"},
    // {type:1 , name:"午餐前" ,addition:"餐前"},{type:1 , name:"午餐后" ,addition:"餐后"},
    // {type:2 , name:"晚餐前" ,addition:"餐前"},{type:2 , name:"晚餐后" ,addition:"餐后"},
    // {type:10 , name:"睡前" ,addition:""}],
    // type:["早","午","晚"]

    commitStatus : true,
  },

  //page func
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      measureDateTime: e.detail.value + " " + this.data.time + ":00"
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      measureDateTime: this.data.date + " " + e.detail.value + ":00"
    });
  },
  bindAdditionMarkChange: function(e) {
    this.setData({
      // additionMark:this.data.markArr[e.detail.value].addition,
      // type:this.data.markArr[e.detail.value].type,
      // additionMarkType:this.data.markArr[e.detail.value].name,
      timePoint:this.data.markArr[e.detail.value].name
    });
  },
  bindInputBloodGlucose: function(e) {
    this.setData({
      bloodGlucose: e.detail.value
    });
  },
  bindInputCom: function(e) {
    this.setData({
      memo: e.detail.value
    });
  },

  
  /**
   *  数据校验
   */
  inputValidate: function() {
    var bloodGlucose = parseFloat(this.data.bloodGlucose);
    // var additionMark = this.data.additionMark;
    // var type = parseInt(this.data.type);
    var timePoint = this.data.timePoint;
    let title = "",
      warn = "";
    if (!bloodGlucose) title += "血糖值,";
    if (!timePoint) title += "类型,";
    if (bloodGlucose < 1 || bloodGlucose > 34) warn += "血糖值,";
    if (title) {
      wx.showToast({
        title: "请输入" + title.slice(0, -1),
        icon: "none"
      });
      return 1;
    } else if (warn) {
      wx.showToast({
        title: warn.slice(0, -1) + "输入异常",
        icon: "none"
      });
      return 1;
    }
    return 0;
  },

  /**
   *  status 新增0 修改 删除255
   */
  dataManager: function(e) {
    var that = this;
    this.setData({
      event: e
    });
    let status = e.currentTarget.dataset.status;
    let data, url;
    //检查数据
    if (this.inputValidate()) {
      return false;
    }
    //set status
    if(status == 255){
      data = {
        serialNo: parseInt(this.data.serialNo),
      }
      url = vicoBloodGlucoseDelete
    }else if(status == 254){
      data = {
        bloodGlucose: parseFloat(this.data.bloodGlucose),
        timePoint: this.data.timePoint,
        // additionMark: this.data.additionMark,
        measureDateTime: this.data.measureDateTime,
        serialNo: parseInt(this.data.serialNo),
        memo: this.data.memo,
      };  
      url = vicoBloodGlucoseCommit
    }else{
      data = {
        bloodGlucose: parseFloat(this.data.bloodGlucose),
        timePoint: this.data.timePoint,
        // additionMark: this.data.additionMark,
        measureDateTime: this.data.measureDateTime,
        memo: this.data.memo,
      };
      url = vicoBloodGlucoseCommit
    }

    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    if(that.data.commitStatus){
        tokenRequest({ url: url, header: header, method: method, data: data }).then(
            res => {
                // console.log(res)
                if (res.data.code == 20001) {
                    console.log("relogin");
                    setTimeout(() => {
                        that.dataManager(that.data.event);
                    }, 700);
                } else {
                    // if (!status) {
                    //   app.globalData.bptask--;
                    // }
                    that.data.commitStatus = false;
                    wx.showToast({
                        title: "成功",
                        icon: "success"
                    });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1500);
                }
            }
        );
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var datetime = options.time,
      date,
      time;
    if (options.id != 0) {
      date = datetime.split(" ")[0];
      time = datetime.split(" ")[1].slice(0, -3);
      let timePoint = parseInt(options.timePoint);
      // if (type == 10) addition = "睡前"
      // else addition = this.data.type[type] + options.additionMark
      this.setData({
        date: date,
        time: time,
        measureDateTime: datetime,
        bloodGlucose: options.bloodGlucose,
        timePoint: options.timePoint,
        memo: options.memo,
        serialNo: options.id
      });
    } else {
      this.setData({
        date: util.formatTime2(new Date()),
        time: util.formatTime4(new Date()),
        measureDateTime: util.formatTime3(new Date())
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})