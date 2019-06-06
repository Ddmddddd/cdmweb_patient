//健康课堂模块
const eduBaseUrl = "https://edu.zjubiomedit.com/healtheducation/"

const eduSubscribeApi = eduBaseUrl + "api/data/subscribe"
const eduTodayScheduleApi = eduBaseUrl + 'api/data/today?patientId='
const eduTodayLoginApi = eduBaseUrl + 'api/data/login?patientId='
const eduMainCoursesApi = eduBaseUrl + 'api/data/mainCourses?patientId='
const eduScheduleAndCourseApi = eduBaseUrl + "api/data/schedule?patientId="
const eduWXKnowledgeDetailApi = eduBaseUrl + "api/kno/wx/knowledge"
const eduRecordApi = eduBaseUrl + "api/data/record"
const eduFavorApi = eduBaseUrl + "api/data/favor"

//健康资讯模块
const mesBaseUrl = 'https://edu.zjubiomedit.com/health-knowledge/'
const mesGet = mesBaseUrl + 'GetTopNKno.jsp?count='
const mesContentGet = mesBaseUrl + 'getKnoContent.jsp?kno_id='
/**
 * 新接口url
 */
const vicoBaseUrl = 'https://cdmwb-dev.vico-lab.com'
// const vicoBaseUrl = 'https://nx.zjubiomedit.com'
//公共平台接口 字典信息 获取议员列表
const vicoDivisionGet = vicoBaseUrl + '/public/dict/division/base/info'
const vicoDoctorGet = vicoBaseUrl + '/public/dict/org/and/doctor/info'
//患者平台接口
//权限管理
const vicoLoginUrl = vicoBaseUrl + '/auth/login/patient'
const vicoValidate = vicoBaseUrl + '/auth/validate/user/name/patient'
const vicoRegister = vicoBaseUrl + '/auth/register/user/patient'
const vicoCaptcha = vicoBaseUrl + '/auth/captcha/patient'
const vicoRsa = vicoBaseUrl + '/auth/rsa/key/public/patient'
//数据管理
const vicoLogedUrl = vicoBaseUrl + '/patient.api/data/patient/logined'
const vicoBloodPressureCommit = vicoBaseUrl + '/patient.api/data/blood/pressure/record/commit'
const vicoBloodPressureGet = vicoBaseUrl + '/patient.api/data/blood/pressure/record/communicate-list'
const vicoBloodPressureDelete = vicoBaseUrl + '/patient.api/data/blood/pressure/record/delete'
const vicoWeightCommit = vicoBaseUrl + '/patient.api/data/weight/record/commit'
const vicoWeightGet = vicoBaseUrl + '/patient.api/data/weight/record/communicate-list'
const vicoWeightDelete = vicoBaseUrl + '/patient.api/data/weight/record/delete'
const vicoDrugCommit = vicoBaseUrl + '/patient.api/data/drug/record/commit'
const vicoDrugGet = vicoBaseUrl + '/patient.api/data/drug/record/communicate-list'
const vicoDrugDelete = vicoBaseUrl + '/patient.api/data/drug/record/delete'
const vicoDietCommit = vicoBaseUrl + '/patient.api/data/diet/record/commit'
const vicoDietGet = vicoBaseUrl + '/patient.api/data/diet/record/communicate-list'
const vicoDietDelete = vicoBaseUrl + '/patient.api/data/diet/record/delete'
const vicoSportCommit = vicoBaseUrl + '/patient.api/data/sport/record/commit'
const vicoSportGet = vicoBaseUrl + '/patient.api/data/sport/record/communicate-list'
const vicoSportDelete = vicoBaseUrl + '/patient.api/data/sport/record/delete'
const vicoDiscomfortCommit = vicoBaseUrl + '/patient.api/data/discomfort/record/commit'
const vicoDiscomfortGet = vicoBaseUrl + '/patient.api/data/discomfort/record/communicate-list'
const vicoDiscomfortDelete = vicoBaseUrl + '/patient.api/data/discomfort/record/delete'
const vicoBloodGlucoseGet = vicoBaseUrl + '/patient.api/data/blood/glucose/record/communicate-list'
const vicoBloodGlucoseCommit = vicoBaseUrl + '/patient.api/data/blood/glucose/record/commit'
const vicoBloodGlucoseDelete = vicoBaseUrl + '/patient.api/data/blood/glucose/record/delete'
const vicoMonthlyReport = vicoBaseUrl + '/patient.api/data/monthly/report'
const vicoDoctorListGet = vicoBaseUrl + '/patient.api/data/doctor/patient/chat/doctor/list'
const vicoChatHistoryListGet = vicoBaseUrl + '/patient.api/data/doctor/patient/chat/msg/list'
const vicoChatRead = vicoBaseUrl +'/patient.api/data/doctor/patient/chat/msg/read'
const vicoChatSend = vicoBaseUrl +'/patient.api/data/doctor/patient/chat/msg/send'

//用户管理
const vicoPhoneChange = vicoBaseUrl + '/patient.api/account/phone/change'
const vicoPasswordChange = vicoBaseUrl + '/patient.api/account/password/change'

//wss
// const vicoWebsocket = 'wss://nx.zjubiomedit.com/patient.api/socket/notify/subscribe?token='
export {
  eduBaseUrl,
  eduSubscribeApi,
  eduTodayScheduleApi,
  eduTodayLoginApi,
  eduMainCoursesApi,
  eduScheduleAndCourseApi,
  eduWXKnowledgeDetailApi,
  eduRecordApi,
  eduFavorApi,
  //
  mesContentGet,
  mesGet,
  //
  vicoDivisionGet,
  vicoDoctorGet,
  //
  vicoLoginUrl,
  vicoValidate,
  vicoRegister,
  vicoCaptcha,
  vicoRsa,
  //
  vicoLogedUrl,
  vicoWeightCommit,
  vicoWeightGet,
  vicoWeightDelete,
  vicoDrugCommit,
  vicoDrugGet,
  vicoDrugDelete,
  vicoSportCommit,
  vicoSportGet,
  vicoSportDelete,
  vicoDietCommit,
  vicoDietGet,
  vicoDietDelete,
  vicoDiscomfortCommit,
  vicoDiscomfortGet,
  vicoDiscomfortDelete,
  vicoBloodPressureCommit,
  vicoBloodPressureDelete,
  vicoBloodPressureGet,
  vicoBloodGlucoseCommit,
  vicoBloodGlucoseDelete,
  vicoBloodGlucoseGet,
  vicoMonthlyReport,
  vicoDoctorListGet,
  vicoChatHistoryListGet,
  vicoChatRead,
  vicoChatSend,
  //
  vicoPasswordChange,
  vicoPhoneChange,
  //
  // vicoWebsocket
}
