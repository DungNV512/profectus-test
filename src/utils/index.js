'use strict'
const moment = require('moment')
const $ = require('jquery')

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

if (!ProfectusCommon) {
  var ProfectusCommon = {}
}

ProfectusCommon.ajax = {
  get: function get(path, success, error) {
    $.ajax({
      type: 'GET',
      url: path,
      cache: false,
      success: success,
      error: error,
    })
  },
  getJson: function getJson(path, success, _error, callError) {
    $.ajax({
      type: 'GET',
      url: path,
      dataType: 'json',
      cache: false,
      success: success,
      error: function error(response, status, errorType) {
        if (callError === true) {
          _error.call('', response, status, errorType)
        } else {
          ProfectusCommon.ajax.handleError(response, status, errorType, _error)
        }
      },
    })
  },
  deleteRequest: function deleteRequest(path, success, error) {
    var csrfTokenName = 'XSRF-TOKEN'
    var data = ProfectusCommon.util.appendCsrfToken({})
    $.ajax({
      type: 'DELETE',
      url: path,
      beforeSend: function beforeSend(request) {
        request.setRequestHeader(
          'X-' + csrfTokenName,
          ProfectusCommon.util.cookieValue(csrfTokenName),
        )
      },
      success: success,
      error: error,
    })
  },
  put: function put(data, path, success, _error2) {
    var _data = ProfectusCommon.util.appendCsrfToken(data)

    _data = ProfectusCommon.util.appendRequestToken(_data)
    $.ajax({
      type: 'PUT',
      url: path,
      data: _data,
      success: success,
      error: function error(response, status, errorType) {
        ProfectusCommon.ajax.handleError(response, status, errorType, _error2)
      },
    })
  },
  patchJson: function patchJson(data, path, success, _error3) {
    var csrfTokenName = 'XSRF-TOKEN'

    var _data = ProfectusCommon.util.appendCsrfToken(data)

    _data = ProfectusCommon.util.appendRequestToken(_data)
    $.ajax({
      type: 'PATCH',
      url: path,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(_data),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader(
          'X-' + csrfTokenName,
          ProfectusCommon.util.cookieValue(csrfTokenName),
        )
      },
      success: success,
      error: function error(response, status, errorType) {
        ProfectusCommon.ajax.handleError(response, status, errorType, _error3)
      },
    })
  },
  putJson: function putJson(data, path, success, _error4) {
    var csrfTokenName = 'XSRF-TOKEN'

    var _data = ProfectusCommon.util.appendCsrfToken(data)

    _data = ProfectusCommon.util.appendRequestToken(_data)
    $.ajax({
      type: 'PUT',
      url: path,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(_data),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader(
          'X-' + csrfTokenName,
          ProfectusCommon.util.cookieValue(csrfTokenName),
        )
      },
      success: success,
      error: function error(response, status, errorType) {
        ProfectusCommon.ajax.handleError(response, status, errorType, _error4)
      },
    })
  },
  postJson: function postJson(data, path, success, _error5) {
    var csrfTokenName = 'XSRF-TOKEN'

    var _data = ProfectusCommon.util.appendCsrfToken(data)

    _data = ProfectusCommon.util.appendRequestToken(_data)
    $.ajax({
      type: 'POST',
      url: path,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(_data),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader(
          'X-' + csrfTokenName,
          ProfectusCommon.util.cookieValue(csrfTokenName),
        )
      },
      success: success,
      error: function error(response, status, errorType) {
        ProfectusCommon.ajax.handleError(response, status, errorType, _error5)
      },
    })
  },
  post: function post(data, path, success, _error6) {
    var _data = ProfectusCommon.util.appendCsrfToken(data)

    _data = ProfectusCommon.util.appendRequestToken(_data)
    $.ajax({
      type: 'POST',
      url: path,
      data: _data,
      success: success,
      error: function error(response, status, errorType) {
        ProfectusCommon.ajax.handleError(response, status, errorType, _error6)
      },
    })
  },
  postBinary: function postBinary(data, path, success, error) {
    var csrfTokenName = 'XSRF-TOKEN'
    $.ajax({
      type: 'POST',
      beforeSend: function beforeSend(request) {
        request.setRequestHeader(
          'X-' + csrfTokenName,
          ProfectusCommon.util.cookieValue(csrfTokenName),
        )
      },
      processData: false,
      contentType: false,
      url: path,
      data: data,
      success: success,
      error: error,
    })
  },
  handleError: function handleError(response, status, errorType, error) {
    if (response.status == 403 || response.status == 404) {
      console.log(response)
      window.location = window.location.pathname + '/404'
      return
    } else if (response.status == 500) {
      window.location = window.location.pathname + '/500'
      return
    }

    error.call('', response, status, errorType)
  },
  download: function download(
    data,
    path,
    method,
    contentType,
    success,
    onError,
  ) {
    var xhr = new XMLHttpRequest()
    xhr.open(method, path, true)
    xhr.responseType = 'arraybuffer'

    xhr.onload = function () {
      if (this.status === 200) {
        var filename = ''
        var disposition = xhr.getResponseHeader('Content-Disposition')

        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          var matches = filenameRegex.exec(disposition)
          if (matches != null && matches[1])
            filename = matches[1].replace(/['"]/g, '')
        }

        var type = xhr.getResponseHeader('Content-Type')
        var blob = new Blob([this.response], {
          type: type,
        })

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were
          // revoked by closing the blob for which they were created.
          // These URLs will no longer resolve as the data backing the
          // URL has been freed."
          window.navigator.msSaveBlob(blob, filename)
        } else {
          var URL = window.URL || window.webkitURL
          var downloadUrl = URL.createObjectURL(blob)

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement('a') // safari doesn't support this yet

            if (typeof a.download === 'undefined') {
              window.location = downloadUrl
            } else {
              a.href = downloadUrl
              a.download = filename
              document.body.appendChild(a)
              a.click()
            }
          } else {
            window.location = downloadUrl
          }

          setTimeout(function () {
            URL.revokeObjectURL(downloadUrl)
          }, 100) // cleanup
        }

        success.call()
      } else if (onError) {
        onError.call()
      }
    }

    var csrfTokenName = 'XSRF-TOKEN'
    xhr.setRequestHeader(
      'X-' + csrfTokenName,
      ProfectusCommon.util.cookieValue(csrfTokenName),
    )
    var _contentType = contentType

    if (!_contentType) {
      _contentType = 'application/x-www-form-urlencoded'
    }

    xhr.setRequestHeader('Content-Type', contentType)

    if (_contentType == 'application/json') {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send(data)
    }
  },
}

ProfectusCommon.util = {
  openLink: function openLink(path, event) {
    if (event.ctrlKey) {
      window.open(path)
    } else {
      window.location = path
    }
  },
  emptyFormValue: function emptyFormValue() {
    return {
      isValid: true,
      message: '',
      value: '',
    }
  },
  loadField: function loadField(url, field) {
    var _this = this

    this.setState({
      isLoading: true,
    })
    ProfectusCommon.ajax.getJson(
      url,
      function (data) {
        _this.setState(
          _defineProperty(
            {
              isLoading: false,
            },
            field,
            data,
          ),
        )
      },
      ProfectusCommon.util.printErrors.bind(this),
    )
  },
  loadFieldWithCallBack: function loadFieldWithCallBack(url, field, callBack) {
    var _this2 = this

    this.setState({
      isLoading: true,
    })
    ProfectusCommon.ajax.getJson(
      url,
      function (data) {
        _this2.setState(
          _defineProperty(
            {
              isLoading: false,
            },
            field,
            data,
          ),
        )

        callBack(data)
      },
      ProfectusCommon.util.printErrors.bind(this),
    )
  },
  loadDataWithCallBack: function loadDataWithCallBack(url, field, callBack) {
    this.setState({
      isLoading: true,
    })
    ProfectusCommon.ajax.getJson(
      url,
      function (data) {
        var _callBack

        callBack(
          ((_callBack = {}),
          _defineProperty(_callBack, field, data),
          _defineProperty(_callBack, 'isLoading', false),
          _callBack),
        )
      },
      ProfectusCommon.util.printErrors.bind(this),
    )
  },
  ref: function ref(name) {
    var _this3 = this

    return function (el) {
      if (_this3[name] === undefined) {
        throw new Error('Invalid ref: '.concat(name))
      }

      _this3[name] = el
    }
  },
  mapErrors: function mapErrors(xhr, errorAlert) {
    var _this4 = this

    this.setState({
      isLoading: false,
      inError: true,
    })
    var alert = errorAlert || this.errorAlert

    if (alert) {
      alert.open()
    }

    xhr.responseJSON.fieldErrors.forEach(function (error) {
      var field = _this4.state[error.field]

      if (field) {
        _this4.setState(
          _defineProperty({}, error.field, {
            value: field.value,
            message: error.message,
            isValid: false,
          }),
        )
      }
    })
  },
  mapObjectFieldErrors: function mapObjectFieldErrors(xhr, object) {
    var _this5 = this

    xhr.responseJSON.fieldErrors.forEach(function (error) {
      var field = object[error.field]

      if (field) {
        _this5.setState({
          object: _defineProperty({}, error.field, {
            value: field.value,
            message: error.message,
            isValid: false,
          }),
        })
      }
    })
    return object
  },
  decorateObjectWithFieldErrors: function decorateObjectWithFieldErrors(
    xhr,
    object,
  ) {
    xhr.responseJSON.fieldErrors.forEach(function (error) {
      var field = object[error.field]

      if (field) {
        object[error.field] = {
          value: field.value,
          message: error.message,
          isValid: false,
        }
      }
    })
    return object
  },
  printErrors: function printErrors(xhr, status, err) {
    console.error(window.location.href, status, err.toString())
    this.setState({
      isLoading: false,
      inError: true,
    })
  },
  toCamelCase: function toCamelCase(originalString) {
    if (originalString === '') {
      return ''
    }

    var strings = originalString.split(/[\s_]/g)
    var result = strings[0].toLowerCase()
    var length = strings.length

    if (length > 1) {
      for (var i = 1; i < length; i++) {
        var string = this.capitalizeFirstLetter(strings[i])
        result = result.concat(string)
      }
    }

    return result
  },
  toAlphaNumeric: function toAlphaNumeric(originalString) {
    return originalString.replace(/[^a-z0-9]/gi, '')
  },
  getQueryString: function getQueryString(field) {
    var url =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : window.location.href
    var reg = new RegExp('[?&]'.concat(field, '=([^&#]*)'), 'i')
    var string = reg.exec(url)
    return string ? string[1] : null
  },
  toDate: function toDate(localDateTime) {
    if (this.isNotEmpty(localDateTime)) {
      return new Date(
        localDateTime.year,
        localDateTime.monthValue - 1,
        localDateTime.dayOfMonth,
        localDateTime.hour ? localDateTime.hour : 0,
        localDateTime.minute ? localDateTime.minute : 0,
        localDateTime.second ? localDateTime.second : 0,
      )
    }

    return ''
  },
  toWholeDate: function toWholeDate(localDateTime) {
    var date = this.toDate(localDateTime)
    date.setHours(0, 0, 0, 0)
    return date
  },
  formatBytes: function formatBytes(bytes) {
    if (bytes < 1024) {
      return ''.concat(bytes, ' Bytes')
    } else if (bytes < 1048576) {
      return ''.concat((bytes / 1024).toFixed(1), ' KB')
    } else if (bytes < 1073741824) {
      return ''.concat((bytes / 1048576).toFixed(2), ' MB')
    }

    return ''.concat((bytes / 1073741824).toFixed(2), ' GB')
  },
  getCurrentDate: function getCurrentDate(format) {
    var _format = this.isNotEmpty(format) ? format : 'DD/MM/YYYY'

    return moment().format(_format)
  },
  toSaveDateFormat: function toSaveDateFormat(date) {
    var values = date.split('/')

    if (values.length === 3) {
      return values[2].concat('-', values[1], '-', values[0])
    } // if the date input format is incorrect, return origin value

    return date
  },
  toDateWithFormat: function toDateWithFormat(localDateTime, format) {
    var _format = this.isNotEmpty(format) ? format : 'DD/MM/YYYY'

    if (ProfectusCommon.util.isNotEmpty(localDateTime)) {
      return moment(ProfectusCommon.util.toDate(localDateTime)).format(_format)
    }

    return ''
  },
  toDateFromSqlDate: function toDateFromSqlDate(sqlDate) {
    if (
      ProfectusCommon.util.isNotEmpty(sqlDate) &&
      ProfectusCommon.util.isNotUndefined(sqlDate)
    ) {
      return new Date(sqlDate)
    }

    return ''
  },
  toDateFromJavaScriptDateWithFormat:
    function toDateFromJavaScriptDateWithFormat(date, format) {
      var _format = ProfectusCommon.util.isNotEmpty(format)
        ? format
        : 'DD/MM/YYYY'

      if (ProfectusCommon.util.isNotEmpty(date)) {
        return moment(date).format(_format)
      }

      return ''
    },
  resetErrorState: function resetErrorState() {
    for (
      var _len = arguments.length, values = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      values[_key] = arguments[_key]
    }

    values.forEach(function (value) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(function (item) {
          item.isValid = true
          item.message = ''
        })
      } else {
        if ('isValid' in value) {
          value.isValid = true
        }

        if ('message' in value) {
          value.message = ''
        }
      }
    })
  },
  getResetErrorState: function getResetErrorState(state) {
    var result = {}
    Object.keys(state).forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        var field = state[key]

        if (field) {
          result[key] = {
            value: field.value,
            isValid: true,
            message: '',
          }
        }
      }
    })
    return result
  },
  sleep: function sleep(time) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, time)
    })
  },
  newLinesToBreaks: function newLinesToBreaks(text) {
    if (text) {
      return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }

    return ''
  },
  validateRequired: function validateRequired() {
    for (
      var _len2 = arguments.length, fields = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      fields[_key2] = arguments[_key2]
    }

    ProfectusCommon.util.resetErrorState(fields)
    var invalid = false
    fields.forEach(function (field) {
      if (Array.isArray(field) && field.length > 0) {
        field.forEach(function (item) {
          if (ProfectusCommon.util.isEmpty(item.value)) {
            item.isValid = false
            item.message = 'This field is required'
            invalid = true
          }
        })
      } else if (ProfectusCommon.util.isEmpty(field.value)) {
        field.isValid = false
        field.message = 'This field is required'
        invalid = true
      }
    })
    return invalid
  },
  isEmpty: function isEmpty() {
    for (
      var _len3 = arguments.length, values = new Array(_len3), _key3 = 0;
      _key3 < _len3;
      _key3++
    ) {
      values[_key3] = arguments[_key3]
    }

    return values.some(function (value) {
      return (
        !value ||
        value === {} ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      )
    })
  },
  isNotEmpty: function isNotEmpty() {
    var _ProfectusCommon$util

    return !(_ProfectusCommon$util = ProfectusCommon.util).isEmpty.apply(
      _ProfectusCommon$util,
      arguments,
    )
  },
  isEmptyOrSpacesOnly: function isEmptyOrSpacesOnly(passedValue) {
    var newValue = passedValue.trim()
    return !(newValue.length > 0)
  },
  propValueOrEmpty: function propValueOrEmpty(props, key) {
    if (props) {
      return ProfectusCommon.util.valueOrEmpty(props[key.toString()])
    }

    return ''
  },
  valueOrEmpty: function valueOrEmpty(value) {
    if (value) {
      return value
    }

    return ''
  },
  defaultIfEmpty: function defaultIfEmpty(value, defaultValue) {
    if (value) {
      return value
    }

    return defaultValue
  },
  isNotUndefined: function isNotUndefined(value) {
    return typeof value !== 'undefined'
  },
  //     isMounted(component) {
  //
  //        try {
  //
  //            ReactDOM.findDOMNode(component);
  //            return true;
  //
  //        } catch (e) {
  //
  //            console.error("ERROR :: " + e);
  //            return false;
  //        }
  //    }
  isNotBlank: function isNotBlank(value) {
    return value && value.length > 0
  },
  valueWithNbsp: function valueWithNbsp(value) {
    if (value && value.length !== 0) {
      return ''.concat(value, '\xA0')
    }

    return ''
  },
  valueWithBr: function valueWithBr(value) {
    if (value && value.length !== 0) {
      return ''.concat(value, '<br />')
    }

    return ''
  },
  initialiseFormValues: function initialiseFormValues() {
    var state = {}

    for (
      var _len4 = arguments.length, properties = new Array(_len4), _key4 = 0;
      _key4 < _len4;
      _key4++
    ) {
      properties[_key4] = arguments[_key4]
    }

    properties.forEach(function (property) {
      state[property] = {
        value: '',
        message: '',
        isValid: true,
      }
    })
    return state
  },
  appendCsrfToken: function appendCsrfToken(data) {
    var _data = data

    if (_data == null) {
      _data = {}
    }

    var csrfToken = ProfectusCommon.util.cookieValue('XSRF-TOKEN')

    if (this.isNotBlank(csrfToken)) {
      _data._csrf = csrfToken
    }

    return _data
  },
  appendRequestToken: function appendRequestToken(data) {
    var _data = data

    if (_data == null) {
      _data = {}
    }

    var requestToken = ProfectusCommon.util.cookieValue('Request-Token')

    if (this.isNotBlank(requestToken)) {
      _data.requestToken = requestToken
    }

    return _data
  },
  browser: function browser() {
    var ua = navigator.userAgent
    var tem
    var M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
      ) || []

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || []
      return {
        name: 'IE',
        version: tem[1] || '',
      }
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/)

      if (tem != null) {
        return {
          name: 'Opera',
          version: tem[1],
        }
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
    tem = ua.match(/version\/(\d+)/i)

    if (tem !== null) {
      M.splice(1, 1, tem[1])
    }

    return {
      name: M[0],
      version: M[1],
    }
  },
  isSupportedBrowser: function isSupportedBrowser() {
    var browser = ProfectusCommon.util.browser()
    var name = browser.name
    var version = browser.version

    switch (name) {
      case 'MSIE':
        if (version >= 9) {
          return true
        }

        break

      case 'IE':
        if (version >= 5) {
          return true
        }

        break

      case 'Chrome':
        return true

      case 'Firefox':
        return true

      case 'Safari':
        return true

      default:
        return false
    }

    return false
  },
  isUnSupportedBrowser: function isUnSupportedBrowser() {
    return !ProfectusCommon.util.isSupportedBrowser()
  },
  cookieValue: function cookieValue(cname) {
    var name = ''.concat(cname, '=')
    var cookies = document.cookie.split(';')

    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i]

      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }

      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }

    return ''
  },
  hasScrollbar: function hasScrollbar() {
    // The Modern solution
    if (typeof window.innerWidth === 'number') {
      return window.innerWidth > document.documentElement.clientWidth
    } // rootElem for quirksmode

    var rootElem = document.documentElement || document.body // Check overflow style property on body for fauxscrollbars

    var overflowStyle

    if (typeof rootElem.currentStyle !== 'undefined') {
      overflowStyle = rootElem.currentStyle.overflow
    }

    overflowStyle =
      overflowStyle || window.getComputedStyle(rootElem, '').overflow // Also need to check the Y axis overflow

    var overflowYStyle

    if (typeof rootElem.currentStyle !== 'undefined') {
      overflowYStyle = rootElem.currentStyle.overflowY
    }

    overflowYStyle =
      overflowYStyle || window.getComputedStyle(rootElem, '').overflowY
    var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight
    var overflowShown =
      /^(visible|auto)$/.test(overflowStyle) ||
      /^(visible|auto)$/.test(overflowYStyle)
    var alwaysShowScroll =
      overflowStyle === 'scroll' || overflowYStyle === 'scroll'
    return (contentOverflows && overflowShown) || alwaysShowScroll
  },
  capitalizeFirstLetter: function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  },
  appendJsonData: function appendJsonData(originalData, newData) {
    return $.extend(originalData, newData)
  },
  getTextForBoolean: function getTextForBoolean(value) {
    if (value === true) {
      return 'Yes'
    }

    return 'No'
  },
  getPropertyValueFromState: function getPropertyValueFromState(
    state,
    propertyName,
  ) {
    var propertyTokens = propertyName.split('.')

    for (var token in propertyTokens) {
      var property = propertyTokens[token]
      state = state[property]
    }

    return state
  },
  setValueOnPath: function setValueOnPath(path, val, obj) {
    var fields = path.split('.')
    var result = obj

    for (var i = 0, n = fields.length; i < n && result !== undefined; i++) {
      var field = fields[i]

      if (i === n - 1) {
        result[field] = val
      } else {
        result = result[field]
      }
    }

    return JSON.parse(JSON.stringify(obj))
  },
  ready: function ready(fn) {
    if (
      document.attachEvent
        ? document.readyState === 'complete'
        : document.readyState !== 'loading'
    ) {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', fn)
    }
  },
  getEntityReferenceUrl: function getEntityReferenceUrl() {
    var baseUrl = ''.concat(window.location.href)
    return baseUrl.replace('/views', '')
  },
  extractNumber: function extractNumber(value, decimalPlaces, allowNegative) {
    var temp = value // avoid changing things if already formatted correctly

    var reg0Str = '[0-9]*'

    if (decimalPlaces > 0) {
      reg0Str += '[,.]?[0-9]{0,' + decimalPlaces + '}'
    } else if (decimalPlaces < 0) {
      reg0Str += '[,.]?[0-9]*'
    }

    reg0Str = allowNegative ? '^-?' + reg0Str : '^' + reg0Str
    reg0Str = reg0Str + '$'
    var reg0 = new RegExp(reg0Str)
    if (reg0.test(temp)) return true // first replace all non numbers

    var reg1Str =
      '[^0-9' +
      (decimalPlaces != 0 ? '.' : '') +
      (decimalPlaces != 0 ? ',' : '') +
      (allowNegative ? '-' : '') +
      ']'
    var reg1 = new RegExp(reg1Str, 'g')
    temp = temp.replace(reg1, '')

    if (allowNegative) {
      // replace extra negative
      var hasNegative = temp.length > 0 && temp.charAt(0) == '-'
      var reg2 = /-/g
      temp = temp.replace(reg2, '')
      if (hasNegative) temp = '-' + temp
    }

    if (decimalPlaces != 0) {
      var reg3 = /[\,\.]/g
      var reg3Array = reg3.exec(temp)

      if (reg3Array != null) {
        // keep only first occurrence of .
        //  and the number of places specified by decimalPlaces or the entire string if decimalPlaces < 0
        var reg3Right = temp.substring(reg3Array.index + reg3Array[0].length)
        reg3Right = reg3Right.replace(reg3, '')
        reg3Right =
          decimalPlaces > 0 ? reg3Right.substring(0, decimalPlaces) : reg3Right
        temp = temp.substring(0, reg3Array.index) + '.' + reg3Right
      }
    }

    return temp
  },
}

export default ProfectusCommon
