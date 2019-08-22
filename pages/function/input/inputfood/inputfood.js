// pages/input/inputfood/inputfood.js
var util = require("../../../../utils/util.js");
var app = getApp();
import { vicoDietCommit,vicoDietDelete } from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
var foodArr = app.globalData.foodArr;
Page({
  data: {
    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    happenDateTime: "",
    serialNo: 0,
    foodList: [],
    kinds: [],
    appetite: [],
    memo: "",
    type: 0,
    status: 0,

    foodArr: foodArr,
    multiIndex2: [0, 0],
    event:{},
    commitStatus : true,
  },

  bindMultiPickerChange2: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var multiIndex = e.detail.value;
    var newarray = [
      {
        name: foodArr[0][multiIndex[0]].name,
        value: foodArr[1][multiIndex[1]].name
      }
    ];

    this.setData({
      multiIndex2: e.detail.value,
      foodList: this.data.foodList.concat(newarray),
      kinds: this.data.kinds.concat(foodArr[0][multiIndex[0]].name),
      appetite: this.data.appetite.concat(
        foodArr[1][multiIndex[1]].name.slice(0, -1)
      )
    });
  },
  bindMultiPickerColumnChange2: function(e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      foodArr: this.data.foodArr,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    if (!e.detail.column) data.multiIndex2[1] = 0;
    this.setData(data);
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      happenDateTime: e.detail.value + " " + this.data.time + ":00"
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      happenDateTime: this.data.date + " " + e.detail.value + ":00"
    });
  },
  bindInputCom: function(e) {
    this.setData({
      memo: e.detail.value
    });
  },

  //删除
  remove: function(e) {
    var Index = e.target.dataset.index; //拿到是第几个
    this.data.foodList.splice(Index, 1);
    this.data.kinds.splice(Index, 1);
    this.data.appetite.splice(Index, 1);
    this.setData({
      foodList: this.data.foodList,
      kinds: this.data.kinds,
      appetite: this.data.appetite
    });
  },

  /**
   *  数据校验
   */

  inputValidate: function() {
    var kinds = this.data.kinds;
    if (kinds.length <= 0) {
      wx.showToast({
        title: "请添加用餐记录",
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
    var that = this
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
    if(status == 255){
      data = {
        serialNo: this.data.serialNo.toString(),
      }
      url = vicoDietDelete
    }else if(status == 254){
      data = {
        serialNo: this.data.serialNo.toString(),
        kinds: this.data.kinds.toString(),
        appetite: this.data.appetite.toString(),
        happenDateTime: this.data.happenDateTime,
        memo: this.data.memo,
        type: parseInt(this.data.type),
      };
      url = vicoDietCommit
    }else{
      data = {
        kinds: this.data.kinds.toString(),
        appetite: this.data.appetite.toString(),
        happenDateTime: this.data.happenDateTime,
        memo: this.data.memo,
        type: parseInt(this.data.type),
      };
      url = vicoDietCommit
    }
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    if(that.data.commitStatus){
        tokenRequest({ url: url, header: header, method: method, data: data }).then(
            res => {
                if (res.data.code == 20001) {
                    console.log('relogin')
                    setTimeout(()=>{
                        that.dataManager(that.data.event)
                    },700)
                } else {
                    that.data.commitStatus = false;
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
    }

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
      time = datetime.split(" ")[1];
      var kinds = options.kinds.split(","),
        appetite = options.appetite.split(","),
        serialNo = options.id.split(",");
      this.setData({
        date: date,
        time: time,
        happenDateTime: datetime,
        memo: options.memo,
        serialNo: serialNo,
        kinds: kinds,
        appetite: appetite,
        type: options.type
      });
    } else {
      this.setData({
        date: util.formatTime2(new Date()),
        time: util.formatTime4(new Date()),
        happenDateTime: util.formatTime3(new Date()),
        type:options.type
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
