// pages/charts/bplinechart/bplinechart.js
var wxCharts = require('../../../../utils/wxcharts.js');
import {formatTime6} from '../../../../utils/util';
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
      spColor: [],
      dp: [],
      dpColor: [],
      hr: [],
      hrColor: [],
    };
    var bps = (this.data.bps).reverse();
    if (bps.length > 14) {
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
      chartsdate.spColor.push(item.systolicPressure>140 ? '#FF4500':'#666666');
      chartsdate.dp.push(item.diastolicPressure);
      chartsdate.dpColor.push(item.diastolicPressure>90 ? '#FF4500':'#666666');
      chartsdate.hr.push(item.heartRate);
      chartsdate.hrColor.push('#666666');
      return formatTime6(item.measureDateTime)
    })
    chartsdate.categories.push('')
    // console.log(chartsdate)
    return chartsdate
  },

  drawlinechart: function () {

    var weekData = this.createData();
    this.setData({weekData})
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: weekData.categories,
      animation: true,
      series: [{
        name: '收缩压',
        data: weekData.sp,
        pointColor: weekData.spColor
      }, {
        name: '舒张压',
        data: weekData.dp,
        pointColor: weekData.dpColor,
      }, {
        name: '心率',
        data: weekData.hr,
        color:'#95D42A',
        pointColor: weekData.hrColor,
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '血压mmHg',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 40
      },
      width: this.data.windowWidth,
      height: this.data.windowHeight*0.8,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: this.data.enableScroll,
      extra: {
        lineStyle: 'curve'
      },
      drawDashedLine: true,
      dashedLine:[{
        endX:50,
        endY:155,
        startX:500,
        startY:155,
        lineLength:5,
        color:"#FF4500",
      },{
        endX:50,
        endY:273,
        startX:500,
        startY:273,
        lineLength:5,
        color:"#FF4500",
      }]
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
            wx.navigateBack({
            })
          }
        }
      })
    }
    else {
      this.drawlinechart();
    }
 

},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})