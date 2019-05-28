//app.js
let socketMsgQueue = []

App({
  globalData: {
    //system info
    windowWidth: 375,
    windowHeight: 667,
    //login info
    loginUserInfo: null,
    managementPlan: null,
    todayRecords: null,
    //TASK
    bptask: 0,
    weighttask: 0,
    medtask: 0,
    classtask: 0,
    //charts
    bps: [],
    wgs: [],
    //websocket
    localSocket:{},
    callback:function(){},
    //const
    foodArr: [
      [
        { id: 0, name: "主食" },
        { id: 1, name: "肉类" },
        { id: 2, name: "蔬菜" },
        { id: 3, name: "水果" },
        { id: 4, name: "蛋类" }
      ],
      [
        { id: 0, name: "50克" },
        { id: 1, name: "100克" },
        { id: 2, name: "110克" },
        { id: 3, name: "120克" },
        { id: 4, name: "130克" },
        { id: 5, name: "140克" },
        { id: 6, name: "150克" },
        { id: 7, name: "160克" },
        { id: 8, name: "170克" },
        { id: 9, name: "180克" },
        { id: 10, name: "190克" },
        { id: 11, name: "200克" },
        { id: 12, name: "210克" },
        { id: 13, name: "220克" },
        { id: 14, name: "230克" },
        { id: 15, name: "240克" },
        { id: 16, name: "250克" },
        { id: 17, name: "260克" },
        { id: 18, name: "270克" },
        { id: 19, name: "280克" },
        { id: 20, name: "290克" },
        { id: 21, name: "300克" },
        { id: 22, name: "310克" },
        { id: 23, name: "320克" },
        { id: 24, name: "330克" },
        { id: 25, name: "340克" },
        { id: 26, name: "350克" },
        { id: 27, name: "360克" },
        { id: 28, name: "370克" },
        { id: 29, name: "380克" },
        { id: 30, name: "390克" },
        { id: 31, name: "400克" },
        { id: 32, name: "410克" },
        { id: 33, name: "420克" },
        { id: 34, name: "430克" },
        { id: 35, name: "440克" },
        { id: 36, name: "450克" },
        { id: 37, name: "460克" },
        { id: 38, name: "470克" },
        { id: 39, name: "480克" },
        { id: 40, name: "490克" },
        { id: 41, name: "500克" },
        { id: 42, name: "510克" },
        { id: 43, name: "520克" },
        { id: 44, name: "530克" },
        { id: 45, name: "540克" },
        { id: 46, name: "550克" },
        { id: 47, name: "560克" },
        { id: 48, name: "570克" },
        { id: 49, name: "580克" },
        { id: 50, name: "590克" },
        { id: 51, name: "600克" },
        { id: 52, name: "610克" },
        { id: 52, name: "620克" },
        { id: 53, name: "630克" },
        { id: 54, name: "640克" },
        { id: 55, name: "650克" },
        { id: 56, name: "700克" },
        { id: 57, name: "750克" },
        { id: 58, name: "800克" },
        { id: 59, name: "850克" },
        { id: 60, name: "900克" },
        { id: 61, name: "950克" }
      ]
    ],
    sportstypeArr: [
      // { id: 0, name: "步行" },
      { id: 1, name: "慢跑" },
      { id: 2, name: "爬楼梯" },
      { id: 3, name: "跳绳" },
      { id: 4, name: "做操" },
      { id: 5, name: "其他" }
    ],
    intensityArr: [
      { id: 0, name: "低" },
      { id: 1, name: "中" },
      { id: 2, name: "高" }
    ]
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  initSocket(url) {
    let that = this
    that.globalData.localSocket = wx.connectSocket({
      url: url
    })
    // that.showLoad()
    that.globalData.localSocket.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
      // that.hideLoad()
      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.shift();
        that.sendSocketMessage(msg);
      }
    })
    that.globalData.localSocket.onMessage(function(res) {
      // that.hideLoad()
      console.log('收到消息啦啊啦啦啦')
      
      that.globalData.callback(res)
    })
    that.globalData.localSocket.onError(function(res) {
      console.log('readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onClose(function (res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
      let token = wx.getStorageSync("login_token");
      let url =
        "wss://nx.zjubiomedit.com/patient.api/socket/notify/subscribe?token=" +
        token;
      that.initSocket(url)
    })
  },
  //统一发送消息
  sendSocketMessage: function (msg) {
    if (this.globalData.localSocket.readyState === 1) {
      // this.showLoad()
      this.globalData.localSocket.send({
        data: JSON.stringify(msg)
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },

});
