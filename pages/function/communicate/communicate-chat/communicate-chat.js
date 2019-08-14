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
    doctorName:'',
    unReadMsgList:[],
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
    this.openWS();
    var query = wx.createSelectorQuery();
    query.select('weui-textarea')
    chatList = [];
    index = 0;
    let chatBasic = JSON.parse(options.chatInfo)
    this.setData({
      doctorId: parseInt(chatBasic.id),
      doctorName: chatBasic.name,
      unReadMsgList: chatBasic.unReadMsgList
    })
    wx.setNavigationBarTitle({
      title: chatBasic.name
    })
    this.getHistoryMsgList(true)
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
        wx.showToast({
            title: "发送信息不能为空！",
            icon: "none"
        });
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
    console.log(this.data.top);
    console.log(this.data.toView);
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

  getHistoryMsgList: function(clearInput) {
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
        if (clearInput) {
          this.setData({
            userInputValue: ''
          })
        }
        this.getMsgHeight()
        if (chatList.length >= 1) {
          this.setData({
            toView: 'msg-' + (chatList.length - 1)
          })
        }
        // 阅读未读的消息
        if (this.data.unReadMsgList.length > 0){
          this.readMsg();
        }else{
          app.globalData.msgtask = 0;
        }
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
        this.getHistoryMsgList(true);
        // let message = {
        //   serialNo: msg.serialNo,
        //   senderID: msg.senderID,
        //   receiverID: msg.receiverID,
        //   msgDateTime: util.formatTime(new Date()),
        //   msgContent: msg.msgContent,
        //   msgFlag: 0,
        //   // idx: index
        // }
        // index++;
        // chatList.push(message);
        // this.setData({
        //   chatList: chatList,
        //   userInputValue: '',
        //   toView: 'msg-' + (chatList.length - 1)
        // })
        // this.getMsgHeight();
      }
    })
  },

  readMsg: function(){
    if (this.data.unReadMsgList.length <= 0) {
      return
    }
    let url = vicoChatRead
    let data = {
      receiverID: this.data.doctorId,
      msgSerialNos: this.data.unReadMsgList
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
      if (res.data.code == 0) {
        app.globalData.msgtask = 0
      }
    })
  },
  /*
    * 创建websocket连接
    * */
  openWS: function () {
    var that = this;
    let token = wx.getStorageSync("login_token");
    let url =
      "wss://test.zjubiomedit.com/patient.api/socket/notify/subscribe?token=" +
      token;
    if (
      app.globalData.localSocket.readyState !== 0 &&
      app.globalData.localSocket.readyState !== 1
    ) {
      console.log(
        "开始尝试连接WebSocket！readyState=" +
        app.globalData.localSocket.readyState
      );
      app.initSocket(url);
    }

    app.globalData.callback = function (res) {
      let resData = JSON.parse(res.data);
      let msg = resData.data;
      if (resData.notifyID == 2) {
        let message = {
          serialNo: msg.serialNo,
          senderID: msg.senderID,
          receiverID: msg.receiverID,
          msgDateTime: msg.msgDateTime,
          msgContent: msg.msgContent,
          msgFlag: 0,
          // idx: index
        }
        index++;
        chatList.push(message);
        that.setData({
          chatList: chatList,
          userInputValue: '',
          toView: 'msg-' + (chatList.length - 1)
        })
        that.getMsgHeight();
      }else if(resData.notifyID == 3) {
        let readList = msg.msgSerialNos
        readList.forEach(item => {
          let targetIndex = -1;
          targetIndex = chatList.findIndex(ele => { return ele.serialNo === item })
          if (targetIndex != -1) {
            let target = chatList[targetIndex]
            target.msgFlag = 1;
            chatList.splice(targetIndex, 1, target)
            that.setData({
              chatList:chatList
            })
          }

        })
      }

    };
  },

})
