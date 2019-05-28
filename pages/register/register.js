// pages/register/register.js
import { request,registWithInfo,validateID, validatePhone} from "../../utils/Request";
import { vicoDivisionGet, vicoDoctorGet, vicoValidate,vicoRegister } from "../../utils/config";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //username 即原patientid 现默认为phoneNumber
    patientName: "",
    sex: "",
    birthDate: "",
    identityCardNumber: "",
    phoneNumber: "",
    education: "",
    profession: "",
    height: "",
    weight: "",
    //password
    password: "",
    passwordcheck: "",

    region: "",
    hospital: "",
    manager: "",

    educationArr: [
      "小学",
      "初中",
      "中专",
      "高中",
      "大专",
      "本科",
      "硕士",
      "博士"
    ],
    professionArr: [
      "工人",
      "农民",
      "科技",
      "行政",
      "教师",
      "金融",
      "商业",
      "医疗",
      "学生",
      "军人",
      "家务",
      "个体",
      "其他"
    ],
    sexArr: ["男", "女"],
    regionArr: [],
    hospitalArr: [],
    managerArr: [],
    multiIndex: [0, 0, 0],
    // error
    nameError: false,
    identityError: false,
    identityErrorMsg: "身份证号格式输入有误",
    passwordError: false,
    phonenumberError: false,
    phonenumberErrorMsg:"该手机号已注册"
  },

  // 患者姓名输入
  patientNameInput: function(e) {
    const patientName = e.detail.value;
    let flag = true;
    if (patientName) flag = false;
    this.setData({
      nameError: flag,
      patientName: patientName
    });
  },

  // 密码输入
  passWordInput: function(e) {
    this.setData({
      password: e.detail.value
    });
  },
  validatePasswordAgain: function() {
    // 这个方法，是为了完善患者修改原密码而不是第二次输入的密码的体验
    if (this.data.passwordError) {
      if (this.data.password === this.data.passwordcheck) {
        this.setData({
          passwordError: false
        });
      }
    } else if (this.data.passwordcheck) {
      if (this.data.password !== this.data.passwordcheck) {
        this.setData({
          passwordError: true
        });
      }
    }
  },
  // 重复确认密码
  passWordCheckInput: function(e) {
    this.setData({
      passwordError: false,
      passwordcheck: e.detail.value
    });
  },
  validatePassword: function() {
    if (this.data.password !== this.data.passwordcheck) {
      this.setData({
        passwordError: true
      });
    }
  },

  // 身份证号输入
  idcardNumberInput: function(e) {
    this.setData({
      identityError: false,
      identityCardNumber: e.detail.value
    });
  },
  validatePatientId: function() {
    const res = validateID(this.data.identityCardNumber);
    if (!res.pass) {
      this.setData({
        identityError: true,
        identityErrorMsg: res.tip
      });
    } else {
      this.setData({
        birthDate: res.birthDate
      });

    }
  },

  // 手机号输入
  phoneNumberInput: function(e) {
    this.setData({
      phonenumberError: false,
      phoneNumber: e.detail.value
    });
  },
  phonenumberCheck: function(e) {
    const res = validatePhone(this.data.phoneNumber);
    if (!res) {
      this.setData({
        phonenumberError: true,
        phonenumberErrorMsg:"手机号输入有误"
      });
    } else {
      request({
        url:vicoValidate,
        method: "POST",
        data: {
          userName:this.data.phoneNumber
        },
      }).then(res => {
        console.log(res)
        if (res.data.data !== 0) {
          this.setData({
            phonenumberError: true,
            phonenumberErrorMsg: "该手机号已注册"
          });
        }
      });
    }
  },

  // 教育程度选择
  bindeducationChange: function(e) {
    this.setData({
      education: this.data.educationArr[e.detail.value]
    });
  },

  // 职业选择
  bindprofessionChange: function(e) {
    this.setData({
      profession: this.data.professionArr[e.detail.value]
    });
  },
  // 性别选择
  sexRadioChange: function(e) {
    this.setData({
      sex: e.detail.value
    });
  },

  // 身高输入
  heightInput: function(e) {
    this.setData({
      height: e.detail.value
    });
  },
  // 体重输入
  weightInput: function(e) {
    this.setData({
      weight: e.detail.value
    });
  },
  //地区输入
  bindRegionChange: function(e) {
    var that = this;
    var region = this.data.regionArr[e.detail.value];
    this.setData({
      region: region,
    });
    request({
      url:vicoDoctorGet,
      data: {
        divisionCode: region.code,
        userType:1,
      },
      method: "POST",
    }).then(res=>{
        that.setData({
          hospitalArr: res.data.data,
          hospital: "",
          manager: "",
          managerArr: []
        });

    })
  },

  bindHospitalChange: function(e) {
    var hospital = this.data.hospitalArr[e.detail.value];
    var manager = '',managerArr = hospital.doctors
    if (hospital.doctors.length < 1){
      manager = hospital.name,
      managerArr = [{
        id:'none',
        name:hospital.name,
        userName:'none'
      }]
    }
    this.setData({
      hospital: hospital,
      managerArr: managerArr,
      manager: manager
    });
  },
  bindManagerChange: function(e) {
    var manager = this.data.managerArr[e.detail.value];
    this.setData({
      manager: manager
    });
  },

  confirm_register: function() {
    const { patientName,identityCardNumber,manager,
      hospital,phoneNumber,education,
      profession,sex,height,weight} = this.data;
    var toast = "";
    const {
      identityError,
      nameError,
      passwordError,
      phonenumberError
    } = this.data;
    //各项数据是否填写
    if (!identityCardNumber) toast = toast.concat("身份证号，");
    if (!phoneNumber) toast = toast.concat("手机号，");
    if (!education) toast = toast.concat("学历，");
    if (!profession) toast = toast.concat("职业，");
    if (!patientName) toast = toast.concat("姓名");
    if (!sex) toast = toast.concat("性别，");
    if (!height) toast = toast.concat("身高，");
    if (!weight) toast = toast.concat("体重，");
    if (!hospital) toast = toast.concat("医院，");
    if (!manager) toast = toast.concat("管理师，");
    if (toast) {
      wx.showToast({
        title: "请输入" + toast.slice(0, -1),
        icon: "none",
        duration: 1500
      });
      return;
    }
    if (identityError || nameError || passwordError || phonenumberError) {
      wx.showToast({
        title: "请注意红字提示",
        icon: "none",
        duration: 1500
      });
      return;
    }
    var userName = phoneNumber
    var patientinfo = {
      userName: userName,
      name: patientName,
      sex: sex,
      dateOfBirth: this.data.birthDate,
      identityCardNumber: identityCardNumber,
      phoneNumber: phoneNumber,
      education: education,
      profession: profession,
      height: parseInt(height),
      weight: parseInt(weight),
      nickname: patientName,
      hospital: hospital.code,
      healthManager: parseInt(manager.id),
      password: this.data.password,
      sourceFrom: "微信小程序"
    };
    console.log(patientinfo)
    request({
      data:patientinfo,
      url:vicoRegister,
      method:'POST'
    }).then(res => {
      wx.showLoading({
        title:'登录中'
      })
      wx.setStorageSync("patientid_token", phoneNumber);
      wx.setStorageSync("password_token", this.data.password);
      setTimeout(() => {
        wx.redirectTo({ url: "../index/index" })
      }, 2000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    request({
      url:vicoDivisionGet,
      method: "POST",
    }).then(res=>{
      // console.log(res.data.data)
      that.setData({
        regionArr: res.data.data
      });

    })
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
