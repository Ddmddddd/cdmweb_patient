// pages/input/inputtip/inputtip.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bloodPressure:"134/89 mmHg",
    heartRate:"80 bpm",
    BPcolor:["B00","B01","B02","B03","B04","B05","B06"],
    HRcolor:["H00","H01","H02"],
    BPtag:["血压偏低","血压理想","血压正常","血压正常偏高","轻度高血压","中度高血压","重度高血压"],
    HRtag:["心率过缓","心率正常","心率过快"],
    BPstatus:"",
    HRstatus:"",
    BPInfo: "请立即卧床休息，二十分钟后再测量一下血压。如果您出现剧烈头痛、胸痛、恶心呕吐、四肢无力等不适症状，请及时联系专科医生或立即复诊。",
    HRInfo: "请持续监测一周，按医嘱服用药物。如果出现头晕头痛、耳鸣等不适症状，请立即复诊。",
    tip:"许多研究表明：配合减肥的降压治疗可以明显减少降压药的用量，而且肥胖跟许多疾病相关，会对全身健康造成负面影响。所以，肥胖的高血压患者可别忘了减肥。"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //get sp dp hr status
    var data = JSON.parse(options.resdata).data;
    console.log(data)
    console.log(data.bpCode)
    let bpindex = parseInt(data.bpCode.slice(-1))
    let hr = parseInt(data.hrValue)
    var hrindex = 1
    if (hr > 100) hrindex = 2
    else if (hr < 50) hrindex = 0
    this.setData({
      bloodPressure: data.bpValue,
      heartRate: data.hrValue,
      BPstatus: data.bpCode,
      HRstatus: data.hrCode,
      BPInfo: data.bpTips,
      HRInfo: data.hrTips,
      bpindex:bpindex,
      hrindex:hrindex
      // tip: data.tip
    })
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