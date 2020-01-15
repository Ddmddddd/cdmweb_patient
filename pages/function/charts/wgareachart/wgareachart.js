// pages/charts/wglinechart/wglinechart.js

var wxCharts = require('../../../../utils/wxcharts.js');
import {formatTime6} from '../../../../utils/util';
var app = getApp();
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wgs: [],
    windowWidth: 0,
    windowHeight: 0,
    enableScroll: false,
    bmi: 0,
    status: '正常',
  },

  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  createData: function () {
    var that = this;
    var chartsdate = {
      categories: [],
      wg: [],
      wgColor: [],
    };
    var wgs = (this.data.wgs).reverse();
    if (wgs.length > 20) {
      that.setData({
        enableScroll: true
      })
    }
    else {
      that.setData({
        enableScroll: false
      })
    }
    chartsdate.categories = wgs.map(function (item) {
      chartsdate.wg.push(item.weight);
      chartsdate.wgColor.push('#666666');
      return formatTime6(item.measureDateTime)
    })
    chartsdate.categories.push('')
    return chartsdate;
  },

  drawlinechart: function (e) {

    var weekData = this.createData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: weekData.categories,
      animation: true,
      series: [{
        name: '体重',
        data: weekData.wg,
        pointColor: weekData.wgColor,
      }],
      yAxis: {
        title: 'kg',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 35
        // fontColor: '#83bff6',
        // gridColor: '#8085e9',
        // titleFontColor: '#f7a35c'
      },
      xAxis: {
        disableGrid: false
      },
      extra: {
        // legendTextColor: '#cb2431'
      },
      width: this.data.windowWidth,
      enableScroll: this.data.enableScroll,
      height: this.data.windowHeight*0.8,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wgs: app.globalData.wgs,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight,
    });
    if (this.data.wgs.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '近三月暂无体重数据',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
            })
          }
        }
      })
    }
    else {
      this.drawlinechart()
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
      var weight = this.data.wgs[this.data.wgs.length-1].weight;
      var height = app.globalData.height/100;
      let bmi = weight/(height*height);
      bmi = bmi.toFixed(1);
      this.setData({
        bmi,
        status: bmi>24 ? '超重' : '正常',
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

  }
})