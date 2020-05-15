# indodana

[![version](https://img.shields.io/npm/v/indodana.svg)](https://www.npmjs.com/package/indodana) [![download](https://img.shields.io/npm/dm/indodana.svg)](https://www.npmjs.com/package/indodana)
[![status status](https://travis-ci.org/egg-/indodana.svg?branch=master)](https://travis-ci.org/egg-/indodana)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Node.js module for using the indodana API


## Usage

```javascript
const Indodana = require('indodana')

const indodana = new Indodana({
  apiKey: 'api key',
  apiSecret: 'api secret',
  environment: 'PRODUCTION' // if not set, will default to 'SANDBOX'
})

indodana.loadInstallmentOptions({
  amount: 400000,
  items: [{} ... ]
}, function (err) {
  // ...
})

indodana.checkout()
indodana.checkTransactionStatus()
indodana.cancellation()
```

## Object Type References

https://indodana.gitbook.io/indodana-paylater/integrations/api-reference#object-type-references


## License

indodana is licensed under the [MIT license](https://github.com/egg-/indodana/blob/master/LICENSE).
