/* eslint-disable no-unused-vars */
/**
 * Get a Cookie
 *
 * @param {*} cName name of the cookie
 * @return {*} the cookie if it exists
 */
function getCookie (cName) {
  const name = cName + '='
  const cDecoded = decodeURIComponent(document.cookie) // to be careful
  const cArr = cDecoded.split('; ')
  let res
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length)
  })
  return res
}

/**
 * Set a Cookie
 *
 * @param {*} cName name of the cookie
 * @param {*} cValue the value of the cookie
 * @param {*} expDays the expiration date of the cookie
 */
function setCookie (cName, cValue, expDays) {
  const date = new Date()
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + date.toUTCString()
  document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/'
}

/**
 * Get json from API endpoint
 *
 * @param {*} yourUrl url to make a request to
 * @return {*} the response
 */
function getResponse (yourUrl) {
  const Httpreq = new XMLHttpRequest() // a new request
  Httpreq.open('GET', yourUrl, false)
  Httpreq.send(null)
  return Httpreq.responseText
}

function goTo (path) {
  window.location.href = path
}
