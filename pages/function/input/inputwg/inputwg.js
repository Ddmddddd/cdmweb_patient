// pages/input/inputwg/inputwg.js
var util = require("../../../../utils/util.js");
import { vicoWeightCommit,vicoWeightDelete } from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    measureDateTime: "",
    weight: "",
    serialNo: 0,
    memo: "",
    status: 0,
    type: 0,
    event:{}
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      measureDateTime: e.detail.value + " " + this.data.time + ":00"
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      measureDateTime: this.data.date + " " + e.detail.value + ":00"
    });
  },
  bindInputWeight: function(e) {
    this.setData({
      weight: e.detail.value
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
    var weight = Math.abs(this.data.weight);
    if (!weight) {
      wx.showToast({
        title: "请输入体重值",
        icon: "none"
      });
      return 1;
    } else if (weight < 20 || weight > 250) {
      wx.showToast({
        title: "体重输入异常",
        icon: "none"
      });
      return 1;
    }
    return 0;
  },

  /**
   *  status 新增0 修改 删除255
   */
  dataManager: function(e) {
    var that = this;
    this.setData({
      event:e
    })
    let status = e.currentTarget.dataset.status;
    let data,url;
    //检查数据
    if (this.inputValidate()) {
      return false;
    }
    //set status
    if (status == 255) {
      data = {
        serialNo: parseInt(this.data.serialNo),
      };
      url = vicoWeightDelete
    } else if(status == 254){
      data = {
        serialNo: parseInt(this.data.serialNo),
        weight: parseInt(this.data.weight),
        measureDateTime: this.data.measureDateTime,
        memo: this.data.memo,
      };
      url = vicoWeightCommit
    } else {
      data = {
        weight: parseInt(this.data.weight),
        measureDateTime: this.data.measureDateTime,
        memo: this.data.memo,
      };
      url = vicoWeightCommit
    }
    // console.log(data)
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    tokenRequest({ url: url, header: header, method: method, data: data }).then(
      res => {
        // console.log(res)
        if (res.data.code == 20001) {
          console.log('relogin')
          setTimeout(()=>{
            that.dataManager(that.data.event)
          },700)
        } else {
          if (!status) {
            app.globalData.weighttask--;
          }
          wx.showToast({
            title: "成功",
            icon: "success"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    );
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
        serialNo: options.id,
        weight: options.weight,
        memo: options.memo,
        measureDateTime: datetime,
        date: date,
        time: time
      });
    } else {
      this.setData({
        date: util.formatTime2(new Date()),
        time: util.formatTime4(new Date()),
        measureDateTime: util.formatTime3(new Date())
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
