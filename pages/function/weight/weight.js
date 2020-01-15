// pages/weight/weight.js
var util = require("../../../utils/util.js");
import { tokenRequest } from "../../../utils/Request";
import { vicoWeightGet } from "../../../utils/config";
import * as echarts from "../../../components/ec-canvas/echarts.min";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    wgs: [],
    visiblewgs: [],
    date: [],
    visibleDate: "",
  },

  NavChart: function() {
    wx.navigateTo({
      url: "../charts/wgareachart/wgareachart"
    });
  },
  createData: function() {
    var that = this;
    var weight = [];
    var wgs = this.data.wgs.reverse();
    //数据按时间排序
    wgs.sort(function(a, b) {
      if (a.measureDateTime < b.measureDateTime) {
        return 1;
      } else if (a.measureDateTime > b.measureDateTime) {
        return -1;
      } else {
        return 0;
      }
    });
    //从近90天的数据中 获取近一周的数据
    var visiblewgs = wgs.filter(function(item) {
      return item.measureDateTime >= that.data.visibleDate;
    });
    var date = visiblewgs.map(function(item) {
      return item.measureDateTime.split(" ");
    });
    this.setData({
      wgs: wgs,
      date: date,
      visiblewgs: visiblewgs
    });
    // console.log("filter");
    weight = wgs.map(function(item) {
      return item.weight;
    });
    // console.log("create");
    return weight;
  },
  /**
   * 图表部分
  */
  setOption: function(chart) {
    var dataAxis = [];
    var data = this.createData().reverse();
    var yMax = 250;
    var dataShadow = [];

    for (var i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }
    var option = {
      title: {
        text: "体重趋势",
        padding: [20, 20, 0, 20],
        textStyle: {
          color: "#188df0",
          fontWeight: "bold",
          fontSize: 20
        }
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {},
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: "#999"
          }
        }
      },
      series: [
        {
          // For shadow
          type: "bar",
          itemStyle: {
            normal: { color: "rgba(0,0,0,0.05)" }
          },
          barGap: "-100%",
          barCategoryGap: "40%",
          data: dataShadow,
          animation: false
        },
        {
          type: "bar",
          itemStyle: {
            normal: {
              color: "#83bff6"
            }
          },
          data: data
        }
      ]
    };
    chart.setOption(option);
  },
  init: function() {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  refresh: function() {
    // var patientId = this.data.patientId;
    var that = this;
    this.ecComponent = this.selectComponent("#mychart-dom-bar");
    // 获取当日时间
    var now = new Date();
    var end = util.formatTime3(now);
    var start = util.formatTime2(new Date(now - 90 * 24 * 3600 * 1000)) + ' ' + '00:00:00';
    var visibleDate = util.formatTime2(new Date(now - 7 * 24 * 3600 * 1000)) + ' ' + '00:00:00';
    let url = vicoWeightGet
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
      // console.log(res.data.data)
      if (res.data.code == 20001) {
        console.log('relogin')
        setTimeout(()=>{
          that.refresh()
        },700)
      } else {
        that.setData({
          wgs:res.data.data,
          visibleDate:visibleDate
        })
        app.globalData.wgs = res.data.data;
        that.init();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      weightGoal: app.globalData.weightGoal
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refresh();
  },

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
    this.refresh();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // return {
    //   title: "这里是撞墙扭到脖子的盛夏",
    //   path: "/pages/weight/weight?patientid=" + this.data.patientId,
    //   success: function(res) {
    //     wx.getShareInfo({
    //       shareTicket: res.shareTickets[0],
    //       success: function(res) {
    //         console.log(res);
    //       },
    //       fail: function(res) {
    //         console.log(res);
    //       },
    //       complete: function(res) {
    //         console.log(res);
    //       }
    //     });
    //   },
    //   fail: function(res) {
    //     // 分享失败
    //     console.log(res);
    //   }
    // };
  }
});
