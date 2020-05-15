/* global describe it */

const assert = require('assert')
const Indodana = require('../')

describe('Indodana', function () {
  const indodana = new Indodana(require('./config.json'))
  const incorrectIndodana = new Indodana({
    apiKey: 'apikey',
    apiSecret: 'apisecret'
  })

  // test data
  const dummyInstallmentOptions = require('./fixtures/installmentOptions.json')
  const dummyCheckout = require('./fixtures/checkout.json')
  const dummyCancellation = require('./fixtures/cancellation.json')

  const merchantOrderId = (new Date()).getTime() + ''

  dummyCheckout.transactionDetails.merchantOrderId = merchantOrderId
  dummyCancellation.merchantOrderId = merchantOrderId

  it('failed auth error', function (done) {
    incorrectIndodana.loadInstallmentOptions({
      amount: 400000,
      items: []
    }, function (err) {
      assert.strictEqual(err.kind, 'FailedAuthError')
      done()
    })
  })

  it('load installment options', function (done) {
    indodana.loadInstallmentOptions(dummyInstallmentOptions, function (err, res) {
      assert.strictEqual(err, null)
      assert.strictEqual(res.status, 'OK')
      done()
    })
  })

  it('checkout', function (done) {
    indodana.checkout(dummyCheckout, function (err, res) {
      assert.strictEqual(err, null)
      assert.strictEqual(res.status, 'OK')
      done()
    })
  })

  it('check trasaction status', function (done) {
    indodana.checkTransactionStatus(merchantOrderId, function (err, res) {
      assert.strictEqual(err, null)
      assert.strictEqual(res.status, 'OK')
      done()
    })
  })

  it('cancellation', function (done) {
    indodana.cancellation(dummyCancellation, function (err, res) {
      assert.strictEqual(err.kind, 'NotFoundError')
      done()
    })
  })
})
