'use strict'

const request = require('request')
const crypto = require('crypto')

const SANDBOX_HOST = 'https://sandbox01-api.indodana.com/chermes/merchant'
const PRODUCTION_HOST = 'https://api.indodana.com/chermes/merchant'

const ENDPOINT = {
  PAYMENT_CALCULATION: '/v1/payment_calculation',
  CHECKOUT: '/v1/checkout_url',
  CHECK_STATUS: '/v1/transactions/check_status',
  CANCELLATION: '/v1/order_cancellation'
}

/**
 * constructor
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {string} opts.apiSecret
 * @param {string} [opts.environment] 'SANDBOX', 'PRODUCTION' if not set, will default to 'SANDBOX'
 */
function Client (opts) {
  this.host = opts.environment === 'PRODUCTION' ? PRODUCTION_HOST : SANDBOX_HOST
  this.generateSignature = function (nonce) {
    var hmac = crypto.createHmac('sha256', opts.apiSecret)
    var content = [opts.apiKey, nonce].join(':')
    return hmac.update(content).digest('hex')
  }
  this.generateAuthorization = function () {
    var nonce = Math.floor(Date.now() / 1000)
    var signature = this.generateSignature(nonce)
    return [opts.apiKey, nonce, signature].join(':')
  }
}

/**
 * request api
 * @param {object} param
 * @param {string} param.endpoint
 * @param {string} [param.method]
 * @param {object} param.data
 */
Client.prototype.request = function (param, cb) {
  var opts = {
    url: this.host + param.endpoint,
    method: param.method || 'POST',
    json: true,
    headers: {
      Authorization: 'Bearer ' + this.generateAuthorization()
    }
  }

  if (opts.method === 'GET') {
    opts.qs = param.data
  } else {
    opts.body = param.data
  }

  return request(opts, function (err, resp, body) {
    if (err) {
      return cb(err)
    }
    body.status === 'ERROR' ? cb(body.error) : cb(null, body)
  })
}

/**
 * validate authorization header from indodana
 */
Client.prototype.validateAuthorizationHeader = function (header) {
  var authorizationValue = (header.split('Bearer')[1] || '').trim()
  var authorizationData = authorizationValue.split(':')
  var nonce = authorizationData[1]
  var signature = authorizationValue[2]
  var selfSignature = this.generateSignature(nonce)
  return signature === selfSignature
}

Client.ENDPOINT = ENDPOINT

module.exports = Client
