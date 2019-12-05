// pages/input/inputmed/inputmed.js
var util = require("../../../../utils/util.js");
import { vicoDrugCommit,vicoDrugDelete } from "../../../../utils/config";
import { tokenRequest } from "../../../../utils/Request";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //自定义药物数据
    showModal: false,
    definename: "",
    definedosage: "",

    date: util.formatTime2(new Date()),
    time: util.formatTime4(new Date()),
    useDateTime: "",
    memo: "",
    serialNo: [],
    drugName: [],
    dosage: [],
    objectMultiArray: [
      [
        { id: 0, name: "贝那普利片(T) " },
        { id: 1, name: "硝苯地平控释片(T) " },
        { id: 2, name: "氢氯噻嗪片 " },
        { id: 3, name: "阿司匹林肠溶片(T) " },
        { id: 4, name: "依那普利片 " },
        { id: 5, name: "福辛普利钠片(T) " },
        { id: 6, name: "左旋氨氯地平片 " },
        { id: 7, name: "非洛地平缓释片 " },
        { id: 8, name: "苯磺酸氨氯地平片(T) " },
        { id: 9, name: "琥珀酸美托洛尔片(T) " },
        { id: 10, name: "酒石酸美托洛尔片 " },
        { id: 11, name: "阿托伐他汀钙片(T) " },
        { id: 12, name: "瑞舒伐他汀钙片(T) " },
        { id: 13, name: "富马酸比索洛尔片(T) " },
        { id: 14, name: "辛伐他汀片(T) " },
        { id: 15, name: "厄贝沙坦片(T) " },
        { id: 16, name: "坎地沙坦片(T) " },
        { id: 17, name: "氯沙坦钾片(T) " },
        { id: 18, name: "缬沙坦胶囊(T) " },
        { id: 19, name: "北京0号降压片 " },
        { id: 20, name: "螺内酯片 " },
        { id: 21, name: "拉西地平片 " },
        { id: 22, name: "替米沙坦胶囊 " },        
        { id: 23, name: "降血压药物 " }
      ],
      [
        { id: 0, name: "1.25mg" },
        { id: 1, name: "2.5mg" },
        { id: 2, name: "5mg" },
        { id: 3, name: "10mg" },
        { id: 4, name: "15mg" },
        { id: 5, name: "20mg" },
        { id: 6, name: "25mg" },
        { id: 7, name: "30mg" },
        { id: 8, name: "35mg" },
        { id: 9, name: "40mg" },
        { id: 10, name: "45mg" },
        { id: 11, name: "50mg" },
        { id: 12, name: "55mg" },
        { id: 13, name: "60mg" },
        { id: 14, name: "65mg" },
        { id: 15, name: "70mg" },
        { id: 16, name: "75mg" },
        { id: 17, name: "80mg" },
        { id: 18, name: "85mg" },
        { id: 19, name: "90mg" },
        { id: 20, name: "适量" }
      ]
    ],
    multiIndex2: [0, 0],
    event:{}

  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      useDateTime: e.detail.value + " " + this.data.time + ":00"
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      useDateTime: this.data.date + " " + e.detail.value + ":00"
    });
  },
  bindInputCom: function(e) {
    this.setData({
      memo: e.detail.value
    });
  },

  bindMultiPickerChange2: function(e) {
    // console.log("picker发送选择改变，携带值为", e.detail.value);
    var multiIndex = e.detail.value;
    var objectMultiArray = this.data.objectMultiArray;
    this.setData({
      multiIndex2: e.detail.value,
      drugName: this.data.drugName.concat(
        objectMultiArray[0][multiIndex[0]].name
      ),
      dosage: this.data.dosage.concat(objectMultiArray[1][multiIndex[1]].name)
    });
  },

  bindMultiPickerColumnChange2: function(e) {
    // console.log("修改的列为", e.detail.column, "，值为", e.detail.value);
    var data = {
      objectMultiArray: this.data.objectMultiArray,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    if (!e.detail.column) data.multiIndex2[1] = 0;
    this.setData(data);
  },
  //删除
  remove: function(e) {
    var Index = e.target.dataset.index; //拿到是第几个

    this.data.drugName.splice(Index, 1);
    this.data.dosage.splice(Index, 1);
    this.setData({
      drugName: this.data.drugName,
      dosage: this.data.dosage
    });
  },
  //自定义药物
  defineMed: function() {
    this.setData({
      showModal: true
    });
  },
  bindModalInputName: function(e) {
    this.setData({
      definename: e.detail.value
    });
  },
  bindModalInputValue: function(e) {
    this.setData({
      definedosage: e.detail.value + "mg"
    });
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.setData({
      drugName: this.data.drugName.concat(this.data.definename),
      dosage: this.data.dosage.concat(this.data.definedosage)
    });
    this.hideModal();
  },
  /**
   *  数据校验
   */
  inputValidate: function() {
    var drugname = this.data.drugName;
    if (drugname.length <= 0) {
      wx.showToast({
        title: "请添加药物记录",
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
      url = vicoDrugDelete
    }else if(status == 254){
      data = {
        serialNo: this.data.serialNo.toString(),
        drugName: this.data.drugName.toString(),
        dosage: this.data.dosage.toString(),
        useDateTime: this.data.useDateTime,
        memo: this.data.memo,
      }; 
      url = vicoDrugCommit;
    }else{
      data = {
        drugName: this.data.drugName.toString(),
        dosage: this.data.dosage.toString(),
        useDateTime: this.data.useDateTime,
        memo: this.data.memo,
      };
      url = vicoDrugCommit;
    }
    let medstring = JSON.stringify(data);
    wx.setStorageSync("medHistory", medstring)
    let method = "POST";
    let token = wx.getStorageSync("login_token");
    let header = {
      token: token,
      "content-type": "application/json"
    };
    tokenRequest({ url: url, header: header, method: method, data: data }).then(
      res => {
        if (res.data.code == 20001) {
          console.log('relogin')
          setTimeout(()=>{
            that.dataManager(that.data.event)
          },700)
        } else {
          if (!status) {
            app.globalData.medtask--;
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
      var dosage = options.dosage.split(","),
        drugName = options.drugName.split(","),
        serialNo = options.id.split(",");
      this.setData({
        date: date,
        time: time,
        useDateTime: datetime,
        memo: options.memo,
        serialNo: serialNo,
        drugName: drugName,
        dosage: dosage
      });
    } else {
      this.setData({
        date: util.formatTime2(new Date()),
        time: util.formatTime4(new Date()),
        useDateTime: util.formatTime3(new Date())
      });
    }
    // 读取患者的历史服药记录
    var medHistory = wx.getStorageSync("medHistory")
    if (medHistory) {
      var medinfo = JSON.parse(medHistory)
      let {drugName, dosage} = medinfo
      this.setData({
        drugName: drugName.split(","),
        dosage: dosage.split(",")
      })
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
