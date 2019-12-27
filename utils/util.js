const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatTime3 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime4 = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

const formatTime5 = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  return [year, month].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatCalendarDate = (y,m,d) => {
  return [y,m,d].map(formatNumber).join('-')
}

const formatTime6 = date => {
  var arr=[],arr1=[];
  arr = date.split("-");
  arr1 = arr[2].split(":");
  const month = arr[1]
  const dayAndHour = arr1[0]
  const minute = arr[1]

  return [month, dayAndHour].map(formatNumber).join('-') + ':' + [minute].map(formatNumber)
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  formatTime4: formatTime4,
  formatTime5: formatTime5,
  formatTime6: formatTime6,
  formatCalendarDate:formatCalendarDate
}
