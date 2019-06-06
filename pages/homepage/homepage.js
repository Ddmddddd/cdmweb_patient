// pages/homepage/homepage.js
var util = require('../../utils/util.js');
import { request } from "../../utils/Request";
import { eduTodayLoginApi, vicoLogedUrl } from "../../utils/config";
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: "",
    registDate: "",
    diastolicPressureGoal: "",
    systolicPressureGoal: "",
    returnVisitDate: "",
    registTime: 0,
    patientId: '',
    bptask: 0,
    weighttask: 0,
    medtask: 0,
    bgtask:0,
    classtask:0,
    msgtask:0,
  },

  /**
   * 首次进入该页面，计算今日的健康课堂任务数量
   */
  todayStudyList: function() {
    var that = this;
    var patientId = wx.getStorageSync("patientid_token");
    var url = eduTodayLoginApi + patientId;
    request({ url }).then(res => {
      const { data } = res
      if (data.success) {
        app.globalData.classtask = data.result ? data.result.length : 0
        that.setData({
          classtask: app.globalData.classtask
        })
      }
    });
  },

  /**
   * 计算今日 加入血压助手的天数
   */
  calregistTime: function (registDate) {
    var d1 = new Date(registDate);
    var d2 = new Date();
    var day = Math.floor(parseInt(d2.getTime() - d1.getTime()) / (24 * 3600 * 1000));
    this.setData({
      registTime: day
    })
  },


  /**
   * 获取用户登录后的数据
   */
  initDataRequest: function () {
    var that = this
    var token = wx.getStorageSync('login_token');
    let url = vicoLogedUrl
    let header = {
      "token":token,
      "content-type": "application/json" 
    }
    let method = 'POST'
    request({url:url, header:header, method:method}).then(res=>{
      var data = res.data.data
      if (!data) {
        //token 过期 自动重新登陆 ？？？这个函数调用的时候会不会过期呢  好像不会耶
        wx.showToast({
          title: res.data.error.detail,
          icon:'none'
        });

      } else {
        //页面数据初始化
        app.globalData.loginUserInfo = data.loginUserInfo;
        app.globalData.managementPlan = data.managementPlan;
        app.globalData.todayRecords = data.todayRecords;
        var nickname = data.loginUserInfo.nickname || data.loginUserInfo.name;
        var bptask = data.managementPlan.bpTasks.length - data.todayRecords.bpRecordList.length;
        var weighttask = data.managementPlan.weightTasks.length - data.todayRecords.weightRecordList.length;
        var medtask = data.managementPlan.drugTasks.length - data.todayRecords.drugRecordList.length;
        var bgtask = data.managementPlan.bloodGlucoseTasks.length - data.todayRecords.bloodGlucoseRecordList.length;
        var msgtask = data.chatDoctorList.length;
        that.setData({
          nickname: nickname,
          registDate: data.loginUserInfo.registDate || "2016/6/23 18:18:53",
          diastolicPressureGoal: data.managementPlan.goalDBP || 80,
          systolicPressureGoal: data.managementPlan.goalSBP  || 120,
          returnVisitDate: data.managementPlan.returnVisitDate || "暂无",
          bptask: bptask,
          weighttask: weighttask,
          medtask: medtask,
          bgtask:bgtask,
          msgtask:msgtask
        })
        that.calregistTime(that.data.registDate);
        app.globalData.bptask = bptask;
        app.globalData.weighttask = weighttask;
        app.globalData.medtask = medtask;
        app.globalData.bgtask = bgtask;
        app.globalData.msgtask = msgtask;
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:'数据加载中...'
    })
    this.initDataRequest()
    this.todayStudyList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var date = util.formatTime2(new Date());
    // var time = util.formatTime4(new Date());
    // this.setData({
    //   xcxinfo: {
    //     "os": "小程序",
    //     "appVersion": "1.1.0",
    //     "eventName": "e_Main_Xcxlogin",
    //     "eventTime": date + " " +time + ":00"
    //   },
    // })
    // var xcxinfostring = JSON.stringify(this.data.xcxinfo);
    // var patientId = wx.getStorageSync('patientid_token');
    // // console.log(xcxinfostring)
    // // console.log(patientId)
    // wx.request({
    //   url: 'https://zjubiomedit.com/AuxiliaryService.svc/CommitUsabilityInfo',
    //   data: {
    //     "appId": "hypertension",
    //     "userId": patientId,
    //     "data": xcxinfostring,
    //     "dataType": 2
    //   },
    //   method: 'POST',
    //   success: function (res) {
      //     console.log(res.data);
      //     if (res.data.flag == 0) {
        //       console.log(res.data);
        //     }
    //     else {
      
      //     }
      //   },
      //   fail: function (res) {
        //     console.log(res.data);
        //     console.log('is failed')
        //   }
        // })
  
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      bptask: app.globalData.bptask,
      weighttask: app.globalData.weighttask,
      medtask: app.globalData.medtask,
      classtask:app.globalData.classtask,
      msgtask:app.globalData.msgtask
    })
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

  },

})