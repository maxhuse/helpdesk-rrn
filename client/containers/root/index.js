/* globals process */

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  module.exports = require('./root.prod.jsx');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./root.dev.jsx');
}
