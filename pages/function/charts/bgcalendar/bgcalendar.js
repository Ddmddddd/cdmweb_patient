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
    console.log(e.detail);
    var that = this
    let dayscolor = this.data.dayscolor;
    if(dayscolor[dayscolor.length-1].background=="#33ccff"){
      dayscolor.pop();
    }
    dayscolor.push({
      month:'current',
      day:e.detail.day,
      color:'white',
      background:'#33ccff'
    })
    this.setData({
      dayscolor,
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
      }
    })
  },

  monthBgRequest(data) {
    var that = this;
    let url = vicoBloodGlucoseGet;
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
        console.log(res.data.data)
        let bgs = res.data.data
        if (bgs.length != 0) {
          var date;
          date = bgs.map(function(item) {
            let day = item.measureDateTime.split(" ")[0].split("-")[2];
            return day;
          });
          var monthStyle = [];
          date.forEach(e => {
            monthStyle.push({
              month:'current',
              day:e,
              color:'white',
              background:'#95D42A'
            })
          });
          that.setData({
            date: date,
            bgHisData:[],
            dayscolor: monthStyle
          });
        }
      }
    })
  },

  prevMonthChange(e){
    this.setData({
      dayscolor:[]
    })
    let currentMonthString = util.formatCalendarDate(e.detail.currentYear, e.detail.currentMonth, '1');
    let prevMonthString = util.formatCalendarDate(e.detail.prevYear, e.detail.prevMonth, '1');
    let data = {
      measureStartDate: currentMonthString + ' ' + '00:00:00',
      measureEndDate: prevMonthString + ' ' + '00:00:00',
    }
    this.monthBgRequest(data);
  },

  nextMonthChange(e){
    this.setData({
      dayscolor:[]
    })
    let currentMonthString = util.formatCalendarDate(e.detail.currentYear, e.detail.currentMonth, '1');
    var nextMonthString;
    if(e.detail.currentMonth<12) {
      nextMonthString = util.formatCalendarDate(e.detail.currentYear, e.detail.currentMonth+1, '1');
    }else {
      nextMonthString = util.formatCalendarDate(e.detail.currentYear+1, '1', '1');
    }
    let data = {
      measureStartDate: currentMonthString + ' ' + '00:00:00',
      measureEndDate: nextMonthString + ' ' + '00:00:00',
    }
    this.monthBgRequest(data);
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
    let year = new Date().getFullYear();
    let month = new Date().getMonth()+1;
    let currentMonthString = util.formatCalendarDate(year, month, '1');
    var nextMonthString;
    if(month<12) {
      nextMonthString = util.formatCalendarDate(year, month+1, '1');
    }else {
      nextMonthString = util.formatCalendarDate(year+1, '1', '1');
    }
    let data = {
      measureStartDate: currentMonthString + ' ' + '00:00:00',
      measureEndDate: nextMonthString + ' ' + '00:00:00',
    }
    this.monthBgRequest(data);
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