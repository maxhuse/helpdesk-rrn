const crypto = require('crypto');
const co = require('co');
const { roles, httpCodes } = require('../../constants');
const mysql = require('../../sql-module');
const logger = require('../../logger');
const { VALID_EMAIL_REX } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');

const patchAuth = (req, res, next) => co(function* gen() {
  const login = req.body.login || false;
  const password = req.body.password || false;
  const { role } = req.user;
  let email = false;

  // field email may be empty
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

  const fields = {};

  if (email !== false) {
    if (typeof email !== 'string' || (email.length > 0 && !VALID_EMAIL_REX.test(email))) {
      return next(new InputError('server.illegal_patch_data'));
    }

    fields.email = email;
  }

  if (login !== false) {
    if (typeof login !== 'string' || login.length < 6) {
      return next(new InputError('server.illegal_patch_data'));
    }

    fields.login = login;
  }

  if (password !== false) {
    if (typeof password !== 'string' || password.length !== 128) {
      return next(new InputError('server.invalid_password'));
    }

    // hashing password
    fields.salt = (crypto.randomBytes(24)).toString('hex');
    fields.password = crypto.createHmac('sha512', fields.salt)
      .update(password).digest('hex');
  }

  // nothing to patch
  if (Object.keys(fields).length === 0) {
    return res.status(httpCodes.OK).send({});
  }

  const staffOptions = { id: req.user.id, fields };
  const updatedStaffUser = yield mysql.updateStaffUser(staffOptions);

  if (updatedStaffUser.affectedRows === 0) {
    return next(new InputError('server.invalid_staff_id'));
  }

  const result = staffOptions.fields;

  logger.log('info', 'User updated', staffOptions);

  return res.status(httpCodes.OK).send(nullKiller({
    login: result.login,
    email: result.email,
  }));
}).catch(error => next(error));

module.exports = patchAuth;
