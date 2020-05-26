'use strict'

const Client = require('./client')

/**
 * Constant
 */

/**
* constructor
* @param {object} opts
* @param {string} opts.apiKey
* @param {string} opts.apiSecret
* @param {string} [opts.environment] 'SANDBOX', 'PRODUCTION' if not set, will default to 'SANDBOX'
*/
function Indodana (opts) {
  this.checkRequired(opts, ['apiKey', 'apiSecret'])
  this.client = new Client(opts)
}

Indodana.prototype.checkRequired = function (data, names) {
  for (var i = 0; i < names.length; i++) {
    if (names[i].indexOf('.') !== -1) {
      var keys = names[i].split('.')
      if (typeof data[keys[0]][keys[1]] === 'undefined') {
        throw Error(names[i] + ' is required.')
      }
    } else if (typeof data[names[i]] === 'undefined') {
      throw Error(names[i] + ' is required.')
    }
  }

  return true
}

/**
 * get installment options
 * @param {object} param
 * @param {number} param.amount
 * @param {array} param.items
 * @param {function} cb
 */
Indodana.prototype.loadInstallmentOptions = function (param, cb) {
  this.checkRequired(param, ['amount', 'items'])
  this.client.request({
    endpoint: Client.ENDPOINT.PAYMENT_CALCULATION,
    data: param
  }, cb)
}

/**
 * purchase transaction checkout
 * @param {object} param
 * @param {object} param.transactionDetails
 * @param {object} param.customerDetails
 * @param {object} param.sellers
 * @param {object} param.billingAddress
 * @param {string} param.shippingAddress
 * @param {string} [param.paymentType]
 * @param {string} param.approvedNotificationUrl
 * @param {string} [param.cancellationRedirectUrl]
 * @param {string} param.backToStoreUrl
 * @param {string} param.expirationAt
 * @param {function} cb
 */
Indodana.prototype.checkout = function (param, cb) {
  this.checkRequired(param, [
    'transactionDetails', 'customerDetails', 'sellers',
    'billingAddress', 'shippingAddress',
    'approvedNotificationUrl', 'backToStoreUrl'
  ])
  this.client.request({
    endpoint: Client.ENDPOINT.CHECKOUT,
    data: param
  }, cb)
}

/**
 * check transaction status
 * @param {string} merchantObjectId
 * @param {function} cb
 */
Indodana.prototype.checkTransactionStatus = function (merchantOrderId, cb) {
  this.client.request({
    endpoint: Client.ENDPOINT.CHECK_STATUS,
    method: 'GET',
    data: {
      merchantOrderId: merchantOrderId
    }
  }, cb)
}

/**
 * purchase transaction cancellation / refund
 * @param {object} param
 * @param {string} param.refundId
 * @param {string} param.merchantOrderId
 * @param {string} param.cancellationAmount
 * @param {string} param.cancellationReason
 * @param {string} param.cancelledBy
 * @param {string} param.cancellationDate
 */
Indodana.prototype.cancellation = function (param, cb) {
  this.checkRequired(param, [
    'refundId', 'merchantOrderId',
    'cancellationAmount', 'cancellationReason',
    'cancelledBy', 'cancellationDate'
  ])
  this.client.request({
    endpoint: Client.ENDPOINT.CANCELLATION,
    data: param
  }, cb)
}

/**
 * validate authorization header from indodana
 */
Indodana.prototype.validateAuthorizationHeader = function (header) {
  return this.client.validateAuthorizationHeader(header)
}

module.exports = Indodana
