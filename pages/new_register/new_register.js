// pages/register/register.js
import { request, newValidateRequest, validateID, validatePhone, registWithInfo, personInfoVali } from "../../utils/Request";
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

    identityCardNumber: "",
    password: "",
    passwordcheck: "",

    // patientId: ""
    patientName: "",
    nickname: "",
    phoneNumber: "",
    education: "",
    profession: "",
    birthDate: "",
    sex: "",
    height: "",
    weight: "",
    // 从页面参数传递
    region: "",
    hospital: "",
    hospitalName: "",
    manager: "",
    educationArr: ["小学", "初中", "中专", "高中", "大专", "本科", "硕士", "博士"],
    professionArr: ["退休", "工人", "农民", "科技", "行政", "教师", "金融", "商业", "医疗", "学生", "军人", "家务", "个体", "其他"],
    sexArr: ["男", "女"],
    // regionArr: [],
    // hospitalArr: [],
    // managerArr: [],

    // error
    nameError: false,
    identityError: false,
    identityErrorMsg: '身份证号格式输入有误',
    passwordError: false,
    phonenumberError: false

  },

  // 身份证号输入
  idcardNumberInput: function (e) {
    this.setData({
      identityError: false,
      identityCardNumber: e.detail.value
    })
  },
  validatePatientId: function () {
    const res = validateID(this.data.identityCardNumber)
    if (!res.pass) {
      this.setData({
        identityError: true,
        identityErrorMsg: res.tip
      })
    } else {
      this.setData({
        birthDate: res.birthDate
      })
      newValidateRequest(this.data.identityCardNumber, this.data.patientName).then(res => {
        if (res !== "核验成功") {
          this.setData({
            identityError: true,
            identityErrorMsg: res
          })
        }
      })
    }
  },

  // 密码输入
  passWordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  validatePasswordAgain: function() {  // 这个方法，是为了完善患者修改原密码而不是第二次输入的密码的体验
    if(this.data.passwordError) {
      if (this.data.password === this.data.passwordcheck) {
        this.setData({
          passwordError: false
        })
      }
    } else if (this.data.passwordcheck){
      if (this.data.password !== this.data.passwordcheck) {
        this.setData({
          passwordError: true
        })
      } 
    }
  },
  // 重复确认密码
  passWordCheckInput: function (e) {
    this.setData({
      passwordError: false,
      passwordcheck: e.detail.value
    })
  },
  validatePassword: function () {
    if (this.data.password !== this.data.passwordcheck) {
      this.setData({
        passwordError: true
      })
    }
  },

  // 患者姓名输入
  patientNameInput: function (e) {
    const patientName = e.detail.value
    let flag = true
    if (patientName) flag = false
    this.setData({
      nameError: flag,
      patientName: patientName
    })
  },

  // 手机号输入
  phoneNumberInput: function (e) {
    this.setData({
      phonenumberError: false,
      phoneNumber: e.detail.value
    })
  },
  phonenumberCheck: function (e) {
    const res = validatePhone(this.data.phoneNumber)
    if (!res) {
      this.setData({
        phonenumberError: true
      })
    }
  },

  // 教育程度选择
  bindeducationChange: function (e) {
    this.setData({
      education: this.data.educationArr[e.detail.value]
    })
  },

  // 职业选择
  bindprofessionChange: function (e) {
    this.setData({
      profession: this.data.professionArr[e.detail.value]
    })
  },
  // 性别选择
  sexRadioChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },

  // 身高输入
  heightInput: function (e) {
    this.setData({
      height: e.detail.value
    })
  },
  // 体重输入
  weightInput: function (e) {
    this.setData({
      weight: e.detail.value
    })
  },
  confirm_register: function () {
    const { patientName, identityCardNumber, birthDate,
      phoneNumber, education, profession, 
      sex, height, weight } = this.data
    var toast = ''
    const { identityError, nameError, passwordError, phonenumberError } = this.data
    //各项数据是否填写
    if (!identityCardNumber) toast = toast.concat('身份证号，')
    if (!phoneNumber)  toast = toast.concat('手机号，')
    if (!education) toast = toast.concat('学历，')
    if (!profession) toast = toast.concat('职业，')
    if (!patientName) toast = toast.concat('性别')
    if (!sex) toast = toast.concat('性别，')
    if (!height) toast = toast.concat('身高，')
    if (!weight) toast = toast.concat('体重，')
    if (toast){
      wx.showToast({
        title: '请输入' + toast.slice(0,-1),
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (identityError || nameError || passwordError || phonenumberError ) {
      wx.showToast({
        title: '请注意红字提示',
        icon: 'none',
        duration: 1500
      })
      return 
    }
    var patientId = this.data.identityCardNumber
    var patientinfo = {
      "patientId": this.data.identityCardNumber,
      "patientName": this.data.patientName,
      "identityCardNumber": this.data.identityCardNumber,
      "birthDate": this.data.birthDate,
      "sex": this.data.sex,
      "height": this.data.height,
      "weight": this.data.weight,
      "education": this.data.education,
      "profession": this.data.profession,
      "phoneNumber": this.data.phoneNumber,
      "region": this.data.region,
      "province": this.data.province,
      "hospital": this.data.hospital,
      "manager": this.data.manager,
      "bpFrequency": 1,
      "bpSchedule": "0",
      "weightFrequency": 1,
      "weightSchedule": "0",
      "medicationFrequency": 1,
      "medicationSchedule": "0",
      "nickname": this.data.patientName,
      "password": this.data.password
    }

    var dataString = JSON.stringify(patientinfo);
    registWithInfo(patientId, dataString).then(res => {
      wx.showLoading({
        title:'立刻登陆吧'
      })
      setTimeout(() => {
        wx.redirectTo({ url: "../index/index" })
      }, 2000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 从路由的parameters中获取参数
   */
  onLoad: function (options) {
    const { region, province, hospital, manager } = options
    this.setData({
      region, province, hospital, manager
    })
    this.getHospitalInfo()
  },

  // 获取省份内的医院名称
  getHospitalInfo: function () {
    const that = this
    wx.request({
      url: 'https://zjubiomedit.com/HypertensionService.svc/GetHospitalInfoListByProvince',
      data: {
        "provinceCode": that.data.province
      },
      method: 'POST',
      success: function (res) {
        if (res.data.flag == 0) {
          const hospitalArr = res.data.obj
          hospitalArr.forEach(element => {
            if (element.code === that.data.hospital) {
              that.setData({
                hospitalName: element.name
              })
              return
            }
          });
        }
      },
      fail: function (res) {
        console.log('is failed')
      }
    })
  }

})