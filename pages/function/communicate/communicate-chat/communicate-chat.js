// pages/communicate/communicate-chat/communicate-chat.js
var util = require('../../../../utils/util.js');
import {
  tokenRequest
} from "../../../../utils/Request";
import {
  vicoChatHistoryListGet,
  vicoChatRead,
  vicoChatSend,
} from "../../../../utils/config";
var app = getApp();
var chatList = []; //信息记录
var index = 0; // 滚动目标
var windowHeihgt = wx.getSystemInfoSync().windowHeight; // 界面高度
var keyHeight = 0; // 键盘高度
var restHeight = 0;
var historyHeight = 0;
var inputHeight = 0;
var msgHeight = 0;
var top = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctorId: null,
    msgSerialNos:[],
    userInputValue: '',
    chatList: [],
    toView: 'msg-0',
    top: 0
  },
  /**
   * 刷新数据函数
   */
  refresh: function() {
    var that = this;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var query = wx.createSelectorQuery();
    query.select('weui-textarea')
    chatList = [];
    index = 0;
    this.setData({
      doctorId: parseInt(options.doctorId),
      msgSerialNos: options.msgSerialNos
    })
    this.getHistoryMsgList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 获取输入框的高度
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('#user-input').boundingClientRect(function(rect) {
      inputHeight = rect.height;
      historyHeight = windowHeihgt - inputHeight;
    }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // component function
  // 绑定用户输入
  userInput: function(e) {
    this.setData({
      userInputValue: e.detail.value
    })
  },
  // 发送信息
  sendMsg: function() {
    // 获取用户输入信息
    let msgText = this.data.userInputValue;
    if (msgText === "") {
      return
    }
    let msg = {
      receiverID: this.data.doctorId,
      // msgDateTime: util.formatTime(new Date()),
      msgContent: msgText,
    }
    this.send(msg)
  },
  onFocus: function(e) {
    keyHeight = e.detail.height;
    if (chatList.length >= 1) {
      this.setData({
        toView: 'msg-' + (chatList.length - 1)
      })
    }
    // 得到键盘弹出时，剩下的展示界面高度
    if (restHeight === 0) {
      restHeight = windowHeihgt - keyHeight - inputHeight;
    }
    // 根据历史记录的共度，偏移历史信息区域
    if (msgHeight < restHeight) {
      top = keyHeight + 10;
      this.setData({
        top: top
      })
    } else if (msgHeight < historyHeight) {
      top = historyHeight - msgHeight;
      this.setData({
        top: top
      })
    }
  },
  onBlur: function() {
    top = 0;
    this.setData({
      top: top
    })
  },

  getMsgHeight: function() {
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('#msg-area').boundingClientRect(function(rect) {
      msgHeight = rect.height
    }).exec();
  },

  getHistoryMsgList: function() {
    let url = vicoChatHistoryListGet
    let data = {
      doctorId: this.data.doctorId
    }
    let method = "POST"
    let token = wx.getStorageSync('login_token');
    let header = {
      "token": token,
      "content-type": "application/json"
    }
    tokenRequest({
      url: url,
      header: header,
      method: method,
      data: data
    }).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        let data = res.data.data;
        chatList = data
        this.setData({
          chatList: chatList
        })
      }
    })
  },
  send: function(msg){
    let url = vicoChatSend
    let method = "POST"
    let token = wx.getStorageSync('login_token');
    let header = {
      "token": token,
      "content-type": "application/json"
    }
    tokenRequest({
      url: url,
      header: header,
      method: method,
      data: msg
    }).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        let message = {
          serialNo: '',
          senderID: '',
          receiverID: msg.receiverID,
          msgDateTime: util.formatTime(new Date()),
          msgContent: msg.msgContent,
          msgFlag: 0,
          // idx: index
        }
        index++;
        chatList.push(message);
        this.setData({
          chatList: chatList,
          userInputValue: '',
          toView: 'msg-' + (chatList.length - 1)
        })
        this.getMsgHeight();
      }
    })
  },

  readMsg: function(){
    let url = vicoChatRead
    let data = {
      receiverID: this.data.doctorId,
      msgSerialNos: this.data.msgSerialNos
    }
    let method = "POST"
    let token = wx.getStorageSync('login_token');
    let header = {
      "token": token,
      "content-type": "application/json"
    }
    tokenRequest({
      url: url,
      header: header,
      method: method,
      data: data
    }).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        
      }
    })
  }

})