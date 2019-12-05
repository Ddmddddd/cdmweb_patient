var util = require("../../../../utils/util.js");
import { vicoSportCommit,vicoSportDelete } from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
var app = getApp();
Page({
  data: {

    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    happenDateTime: "",
    memo: "",
    serialNo: 0,
    stepCount: 0,
    sportsType: "",
    durationTime: null,
    intensity: "",
    status: 0,

    sportstypeArr: app.globalData.sportstypeArr,
    intensityArr: app.globalData.intensityArr,
    event:{}

  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      happenDateTime: e.detail.value + " " + this.data.time + ":00"
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      happenDateTime: this.data.date + " " + e.detail.value + ":00"
    });
  },
  bindTypeChange: function(e) {
    this.setData({
      sportsType: this.data.sportstypeArr[e.detail.value].name
    });
  },

  bindInputdurationTime: function(e) {
    this.setData({
      durationTime: e.detail.value
    });
  },

  bindintensityChange: function(e) {
    this.setData({
      intensity: this.data.intensityArr[e.detail.value].name
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
    let sportsType = this.data.sportsType,
    intensity = this.data.intensity,
    durationTime = this.data.durationTime;
    let title = ''
    if (sportsType.length <= 0){
      title = title.concat('运动类型,')
    }
    if(intensity.length <= 0 ){
      title = title.concat('运动强度,')
    }
    if(durationTime == null || durationTime.length <= 0){
      title = title.concat('运动时间,')
    }
    console.log(title)
    if(title){
      wx.showToast({
        title:'请填写' + title.slice(0,-1),
        icon:'none'
      })
      return 1
    }
    return 0
  },

 /**
   *  status 新增0 修改 删除255
   */
  dataManager: function(e) {
    var that = this;
    this.setData({
      event:e
    })
    let status = e.currentTarget.dataset.status
    let data,url
    //检查数据
    if(this.inputValidate()){
      return false
    }
    //set status
    if(status == 255){
      data = {
        serialNo: parseInt(this.data.serialNo),
      }
      url = vicoSportDelete
    }else if(status == 254){
      data = {
        serialNo: parseInt(this.data.serialNo),
        memo: this.data.memo,
        happenDateTime: this.data.happenDateTime,
        sportsType: this.data.sportsType,
        durationTime: parseInt(this.data.durationTime),
        intensity: this.data.intensity,
      }    
      url = vicoSportCommit;
    }else{
      data = {
        memo: this.data.memo,
        happenDateTime: this.data.happenDateTime,
        sportsType: this.data.sportsType,
        durationTime: parseInt(this.data.durationTime),
        intensity: this.data.intensity,
      }
      url = vicoSportCommit;
    }
    // console.log(data)
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    tokenRequest({ url: url, header: header, method: method, data: data }).then(res => {
      if (res.data.code == 20001) {
        console.log('relogin')
        setTimeout(()=>{
          that.dataManager(that.data.event)
        },700)
      } else {
        wx.showToast({
          title: "成功",
          icon: "success"
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var datetime = options.time,
      date,
      time;
    if (options.id != 0) {
      date = datetime.split(" ")[0];
      time = datetime.split(" ")[1].slice(0, -3);
      this.setData({
        date: date,
        time: time,
        happenDateTime: datetime,
        memo: options.memo,
        serialNo: options.id,
        stepCount: options.step,
        sportsType: options.sportsType,
        durationTime: options.dur,
        intensity: options.int
      });
    } else {
      this.setData({
        date_sport: util.formatTime2(new Date()),
        time_sport: util.formatTime4(new Date()),
        happenDateTime: util.formatTime3(new Date())
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
