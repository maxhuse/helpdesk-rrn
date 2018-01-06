const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('./logger');
const api = require('./routes');

const app = express();
const helmet = require('helmet');

const i18next = require('i18next');
const { en } = require('../static/translations/index');

app.use(helmet());

// Initialize translations
i18next.init({
  lng: 'en',
  compatibilityJSON: 'v2',
  resources: {
    en: { translation: en },
  },
}, () => {
  // Initialized and ready to go!
  // Geronimo!
});

// Hot mode middlewares
if (process.env.NODE_ENV === 'hot') {
  console.log('It\'s hot!'); // eslint-disable-line no-console

  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpackConfig = require('../webpack.config');
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);

  // HMR
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    historyApiFallback: true,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
  /* eslint-enable global-require, import/no-extraneous-dependencies */
}

// Dev server provide static files
if (process.env.NODE_ENV === 'hot' || process.env.NODE_ENV === 'development') {
  // Favicon
  app.use(favicon(path.join(__dirname, '../static/img/favicon.ico')));

  // Public files
  app.use('/public', express.static(path.join(__dirname, '../public')));
}

// API
app.use('/api', api);

// Index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(3000, 'localhost', (err) => {
  if (err) {
    console.log(err); // eslint-disable-line no-console

    return;
  }

  logger.log('info', 'server started', { port: 3000 });
});
