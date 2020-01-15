// pages/bs/bs.js
var util = require('../../../utils/util.js');
import { tokenRequest } from "../../../utils/Request";
import { vicoBloodGlucoseGet } from "../../../utils/config";
// import * as echarts from '../../components/ec-canvas/echarts.min';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgs:[],
    date:[],
    timePointArr:["晨起空腹","早餐后","午餐前","午餐后","晚餐前","晚餐后","睡前","凌晨"],
    warning:[]

  },

  NavChart:function(){
    let data = JSON.stringify(this.data.bgs)
    wx.navigateTo({
      url: '../charts/bgcalendar/bgcalendar?data=' + data,
    })
  },
   /**
   * 刷新数据函数
   */
  refresh:function(){
    var that=this;
    // 获取当日时间
    var now = new Date();
    var end = util.formatTime3(now);
    var start = util.formatTime2(now) + ' ' + '00:00:00';
    let url = vicoBloodGlucoseGet
    let data = {
      measureStartDate:start,
      measureEndDate:end
    }
    let method = "POST"
    let token = wx.getStorageSync('login_token');
    let header = {
      "token":token,
      "content-type": "application/json" 
    }
    tokenRequest({url:url, header:header, method:method, data:data}).then(res=>{
      // console.log(res)
      if (res.data.code == 20001) {
        console.log('relogin')
        setTimeout(()=>{
          that.refresh()
        },700)
      } else {
        let bgs = res.data.data.reverse();
        let timePointArr = that.data.timePointArr
        that.setData({
          bgs:bgs
        });
        if (bgs.length != 0) {
          var date = bgs.map(function(item) {
            return item.measureDateTime.split(" ");
          });
          var warning = bgs.map(function(item){
            let time = timePointArr.indexOf(item.timePoint) 
            let warning = "normal"
            if ((item.bloodGlucose>=6.7)&&(time==(0||2||4||7))){
              //空腹血糖高
              warning = "high"
            } else if ((item.bloodGlucose>=11.1)&&(time==(1||3||5||6))) {
              //餐后血糖高
              warning = "high"
            } else if (item.bloodGlucose<3.9){
              //低血糖
              warning = "low"
            }
            return  warning          
          })
          that.setData({
            date: date,
            warning:warning
          });
        } 
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bloodGlucoseGoal: app.globalData.bloodGlucoseGoal,
    })
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
    this.refresh()
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
    this.refresh()
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