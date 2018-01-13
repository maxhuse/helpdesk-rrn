const crypto = require('crypto');
const co = require('co');
const { httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const { VALID_EMAIL_REX, roles } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');

const patchAuth = (req, res, next) => co(function* gen() {
  const login = req.body.login || false;
  const password = req.body.password || false;
  const { role } = req.user;
  let email = false;

  // Email field may be empty
  if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
    email = req.body.email;
  }

  if (
    role !== roles.ADMIN &&
    role !== roles.ENGINEER &&
    role !== roles.CUSTOMER
  ) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  const userOptions = { id: req.user.id, fields: {} };

  // Email
  if (email !== false) {
    if (typeof email !== 'string' || (email.length > 0 && !VALID_EMAIL_REX.test(email))) {
      return next(new InputError('server.illegal_patch_data'));
    }

    userOptions.fields.email = email;
  }

  // Login
  if (login !== false) {
    if (typeof login !== 'string' || login.length < 6) {
      return next(new InputError('server.illegal_patch_data'));
    }

    userOptions.fields.login = login;
  }

  // Password
  if (password !== false) {
    if (typeof password !== 'string' || password.length !== 128) {
      return next(new InputError('server.invalid_password'));
    }

    // Hashing password
    userOptions.fields.salt = (crypto.randomBytes(24)).toString('hex');
    userOptions.fields.password = crypto.createHmac('sha512', userOptions.fields.salt)
      .update(password).digest('hex');
  }

  // Nothing to patch
  if (Object.keys(userOptions.fields).length === 0) {
    return res.status(httpCodes.OK).send({});
  }

  const updatedUser = yield sequelize.updateUser(userOptions);

  // In the second element of response is a number of affected rows
  if (updatedUser[1] === 0) {
    return next(new InputError('server.invalid_user_id'));
  }

  const result = userOptions.fields;

  logger.log('info', 'User updated', userOptions);

  return res.status(httpCodes.OK).send(nullKiller({
    login: result.login,
    email: result.email,
  }));
}).catch(error => next(error));

module.exports = patchAuth;
