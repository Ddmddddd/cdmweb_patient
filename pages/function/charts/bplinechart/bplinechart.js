// pages/charts/bplinechart/bplinechart.js
var wxCharts = require('../../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bps: [],
    windowWidth: 0,
    windowHeight: 0,
    enableScroll: false,
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
      sp: [],
      dp: [],
      hr: []
    };
    var bps = (this.data.bps).reverse();
    if (bps.length > 20) {
      that.setData({
        enableScroll: true
      })
    }
    else {
      that.setData({
        enableScroll: false
      })
    }
    chartsdate.categories = bps.map(function (item) {
      chartsdate.sp.push(item.systolicPressure);
      chartsdate.dp.push(item.diastolicPressure);
      chartsdate.hr.push(item.heartRate);
      return item.measureDateTime
    })
    // console.log(chartsdate)
    return chartsdate
  },

  drawlinechart: function () {

    var weekData = this.createData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: weekData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: '收缩压',
        data: weekData.sp,

      }, {
        name: '舒张压',
        data: weekData.dp,

      }, {
        name: '心率',
        data: weekData.hr,

      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '血压mmHg',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 40
      },
      width: this.data.windowWidth - 5,
      height: this.data.windowHeight - 100,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: this.data.enableScroll,
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
      bps: app.globalData.bps,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight,
    });
    // this.ecComponent = this.selectComponent('#mychart-dom-bar');
    // this.init();
    if (this.data.bps.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '近三月暂无血压数据',
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