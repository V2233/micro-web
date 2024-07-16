export const getTime = () => {
  let hours = new Date().getHours()
  let message = ''
  if (hours <= 9) {
    message = '早上'
  } else if (hours <= 12) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}

export const getFormatDate = (date = new Date()) => {
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始的
  let day = String(date.getDate()).padStart(2, '0')
  let hours = String(date.getHours()).padStart(2, '0')
  let minutes = String(date.getMinutes()).padStart(2, '0')
  let seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}
