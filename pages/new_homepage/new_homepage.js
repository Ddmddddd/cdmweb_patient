// pages/new_homepage/new_homepage.js
var util = require('../../utils/util.js');
import { request } from "../../utils/Request";
import { vicoLogedUrl, mesGet } from "../../utils/config";
var app = getApp();

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
    knowledge:[],
  },

  /**
   * 计算今日 加入血压助手的天数
   */
  calregistTime: function (registDate) {
    var d1 = this.dateFromString(registDate);
    var d2 = new Date();
    var day = Math.floor(parseInt(d2.getTime() - d1.getTime()) / (24 * 3600 * 1000));
    this.setData({
      registTime: day
    })
  },

  dateFromString:function(time){
    time = time.replace(/-/g, ':').replace(' ', ':')
    time = time.split(':')
    var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])
    return time1;
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
        var medtask = (data.managementPlan.drugTasks.length - data.todayRecords.drugRecordList.length)<0 ? 0 : data.managementPlan.drugTasks.length - data.todayRecords.drugRecordList.length;
        var bgtask = data.managementPlan.bloodGlucoseTasks.length - data.todayRecords.bloodGlucoseRecordList.length;
        var msgtask = 0
        data.chatDoctorList.forEach(item => {
          msgtask += item.unReadMsgList.length
        })
        let diastolicPressureGoal = data.managementPlan.goalDBP || 90;
        let systolicPressureGoal = data.managementPlan.goalSBP  || 140;
        let bloodGlucoseGoal = data.managementPlan.goalGLU || 6.1;
        let weightGoal = ~~(data.managementPlan.goalBMI*data.loginUserInfo.newestHeight*data.loginUserInfo.newestHeight/10000);
        that.setData({
          nickname: nickname,
          registDate: data.loginUserInfo.registDate || "2016/6/23 18:18:53",
          diastolicPressureGoal,
          systolicPressureGoal,
          returnVisitDate: data.managementPlan.returnVisitDate || "暂无",
          bloodGlucoseGoal,
          weightGoal,
          nowWeight: data.loginUserInfo.newestWeight,
          nowDiastolicPressure: data.todayRecords.bpRecordList.length>0 ? data.todayRecords.bpRecordList[data.todayRecords.bpRecordList.length-1].diastolicPressure : 0,
          nowSystolicPressure: data.todayRecords.bpRecordList.length>0 ? data.todayRecords.bpRecordList[data.todayRecords.bpRecordList.length-1].systolicPressure : 0,
          nowBloodGlucose: data.todayRecords.bloodGlucoseRecordList.length>0 ? data.todayRecords.bloodGlucoseRecordList[data.todayRecords.bloodGlucoseRecordList.length-1].bloodGlucose : 0,
          todayMed: data.todayRecords.drugRecordList.length>0 ? data.todayRecords.drugRecordList.length : 0,
          sex: data.loginUserInfo.sex=="男"? 1 : 0,
          bptask,
          weighttask,
          medtask,
          bgtask,
          msgtask,
        })
        that.calregistTime(that.data.registDate);
        app.globalData.sex = data.loginUserInfo.sex=="男"? 1 : 0;
        app.globalData.height = data.loginUserInfo.newestHeight;
        app.globalData.diastolicPressureGoal = diastolicPressureGoal;
        app.globalData.systolicPressureGoal = systolicPressureGoal;
        app.globalData.bloodGlucoseGoal = bloodGlucoseGoal;
        app.globalData.weightGoal = weightGoal;
      }
    })
  },
  /**
   * 前往今日任务小结
   */
  gotoTodayTask(){
    wx.showToast({
      title:"功能暂未开放，敬请期待！",
      icon:"none",
      duration:2000,
    })
    /*
    wx.navigateTo({
      url: '/pages/today_task/today_task',
    });
    */
  },
  /**
   * 获取四条咨询
   */
  getFourKno(){
    var that = this;
    var count = 4;
    let url = mesGet + count;
    wx.request({
      url, 
      method: "GET",
      header: { "content-type": "application/json"},
      success:res=>{
        const { statusCode } = res;
        if (statusCode > 400 && statusCode < 500) {
          wx.showToast({
            title: "端口请求错啦" + statusCode,
            icon: "none"
          });
          return false
        } else if (statusCode > 500) {
          wx.showToast({
            title: "服务器请求失败" + statusCode,
            icon: "none"
          });
          return false
        }
        else {
          let knowledge1 = res.data.result.knowledge.map(function(item){
            var arr=item.kno_time.split(" ");
            item.kno_time=arr[0];
            return item
          })
          that.setData({
            knowledge:knowledge1
          })
        }
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
      },
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading();
    this.onShow();
    wx.stopPullDownRefresh();
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initDataRequest();
    this.getFourKno();
  }
})