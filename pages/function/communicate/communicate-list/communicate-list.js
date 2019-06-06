// pages/communicate/communicate-list/communicate-list.js
import {vicoBloodGlucoseGet} from "../../../../utils/config";

var util = require('../../../../utils/util.js');
import { tokenRequest } from "../../../../utils/Request";
import { vicoChatListGet } from "../../../../utils/config";
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        chatList : {},
    },

  
    /**
     * 刷新数据函数
     */
    refresh:function(){
        var that=this;

    },

    /*
    * 创建websocket连接
    * */
    openWS: function(){
        let token = wx.getStorageSync("login_token");
        let url =
            "wss://nx.zjubiomedit.com/patient.api/socket/notify/subscribe?token=" +
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

        app.globalData.callback = function(res) {
            setTimeout(() => {
                let resData = res.data;
                this.chatList.forEach(item =>{
                    if(item.UserID === resData.id){
                        this.setData({
                            item : resData,
                        })
                    }
                })
            }, 1500);
        };
    },

    /*
    * 获取和医生的聊天记录列表
    * */
    getChatList: function(){
        let url = vicoChatListGet
        let data = {
            patientID:wx.getStorageSync('patientid_token')
        }
        let method = "POST"
        let token = wx.getStorageSync('login_token');
        let header = {
            "token":token,
            "content-type": "application/json"
        }
        this.setData({
            chatList : [{
                    UserID: 21,
                    Name:   "李老师",
                    UnReadMsgList: ["哈哈","嘻嘻"],
                    LastMsgContent:  "你好呀",
                    LastMsgDateTime: "2019-06-06 09:38",
                },
                {
                    UserID: 22,
                    Name:   "王老师",
                    UnReadMsgList: [],
                    LastMsgContent:  "我很好",
                    LastMsgDateTime: "2019-06-06 09:38",
                },]
        })

        // tokenRequest({url:url, header:header, method:method, data:data}).then(res=>{
        //     console.log(res)
            // if (res.data.code == 20001) {
            //     console.log('relogin')
            //     setTimeout(()=>{
            //         that.refresh()
            //     },700)
            // } else {
            //
            // }
        // })
    },









    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.openWS();
        this.getChatList();
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
        this.refresh()
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
