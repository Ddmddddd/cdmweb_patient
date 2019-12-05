// pages/function/charts/bgcalendar/bgcalendar.js
var util = require('../../../../utils/util.js');
import { tokenRequest } from "../../../../utils/Request";
import { vicoBloodGlucoseGet } from "../../../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayscolor:[],
    bgHisData:[],
    date:[]
  },

  dayClick:function(e){
    // console.log(e.detail);
    var that = this
    this.setData({
      dayscolor:[{
        month:'current',
        day:e.detail.day,
        color:'white',
        background:'#33ccff'
      }]
    })
    let dateString = util.formatCalendarDate(e.detail.year,e.detail.month,e.detail.day)
    console.log(dateString)
    var end = dateString + ' ' + '23:59:59'
    var start = dateString + ' ' + '00:00:00';
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
          that.dayClick()
        },700)
      } else {
        let bgs = res.data.data
        that.setData({
          bgHisData:bgs
        });
        if (bgs.length != 0) {
          var date = bgs.map(function(item) {
            return item.measureDateTime.split(" ");
          });
          that.setData({
            date: date
          });
        }
      }
    })
  },
  
  dateChange:function(e){
    this.setData({
      dayscolor:[]
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let day = new Date().getDate()
    let bgHisData = JSON.parse(options.data)
    let date = bgHisData.map(function(item) {
      if(item){
        return item.measureDateTime.split(" ");
      }
    });
    this.setData({
      bgHisData:bgHisData,
      date:date,
      dayscolor:[{
        month:'current',
        day:day,
        color:'white',
        background:'#33ccff'
      }]
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