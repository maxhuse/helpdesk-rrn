const { httpCodes } = require('../constants');
const i18next = require('i18next');
const logger = require('../logger');

module.exports = (err, req, res) => {
  if (!err.name || err.name === 'Error') {
    err.name = err.code;
  }

  switch (err.name) {
    case 'InputError': {
      logger.log('info', i18next.t(err.message), err);
      res.status(httpCodes.INTERNAL_ERROR).send({
        message: err.message,
      });
      break;
    }

    case 'AuthorizeError': {
      logger.log('info', i18next.t(err.message), err);
      res.status(httpCodes.UNAUTHORIZED).send({
        message: err.message,
      });
      break;
    }

    case 'PermissionError': {
      logger.log('error', i18next.t(err.message), err);
      res.status(httpCodes.FORBIDDEN).send({
        message: err.message,
      });
      break;
    }

    case 'InternalError': {
      logger.log('error', i18next.t(err.message), err);
      res.status(httpCodes.INTERNAL_ERROR).send({
        message: err.message,
      });
      break;
    }

    default: {
      logger.log('error', err);
      res.status(httpCodes.INTERNAL_ERROR).send({
        message: 'server.unknown_error',
      });
    }
  }
};
