const { httpCodes } = require('../constants');
const i18next = require('i18next');
const logger = require('../logger');

// We need "next" here because Express want it for override default error handler
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
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

    // Error while there is a duplicate of the unique field
    case 'SequelizeUniqueConstraintError': {
      logger.log('error', i18next.t('server.duplicate_unique_fields', { fields: err.fields }), err);

      let message = 'server.duplicate_unique_fields';

      if (err.fields.some(field => field === 'login')) {
        message = 'server.user_with_same_login_exists';
      }

      res.status(httpCodes.INTERNAL_ERROR).send({
        message,
        arguments: {
          fields: err.fields,
        },
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
