// this module get user from DB and put into req.user
const express = require('express');
const sequelize = require('../sequelize');
const { roles, httpCodes } = require('../constants');
const { AuthorizeError } = require('../errors');
const logger = require('../logger');
const i18next = require('i18next');

const getUser = express();

const hasExistedRole = role =>
  role === roles.ADMIN ||
  role === roles.ENGINEER ||
  role === roles.CUSTOMER;

getUser.use((req, res, next) => {
  if (!req.session.user || !req.session.user.id || !hasExistedRole(req.session.user.role)) {
    return res.status(httpCodes.UNAUTHORIZED).send({});
  }

  sequelize.getUserById({ id: req.session.user.id })
    .then((result) => {
      // Unexpected! User must be founded!
      if (!result.length || !result[0].id) {
        logger.log('error', i18next.t('server.error_by_getting_user'));

        return next(new AuthorizeError('server.error_by_getting_user'));
      }

      // User is blocked
      if (!result[0].active) {
        return next(new AuthorizeError('server.user_blocked'));
      }

      req.user = {
        id: result[0].id,
        name: result[0].name,
        login: result[0].login,
        role: result[0].role,
        email: result[0].email || '',
      };

      return next();
    }).catch(error => next(error));
});

module.exports = getUser;
