const { httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const crypto = require('crypto');
const { VALID_EMAIL_REX, roles } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const _ = require('lodash');
const co = require('co');

const patchStaffs = (req, res, next) => co(function* gen() {
  const id = parseInt(req.params.staffId, 10);
  const { login, name, role, description, password, email } = req.body;
  const active = req.body.active && parseInt(req.body.active, 10);

  // Only admins able to edit staffs
  if (req.user.role !== roles.ADMIN) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // Validation and creating update object
  const newStaffOptions = { id, fields: {} };

  // ID
  if (isNaN(newStaffOptions.id) || newStaffOptions.id < 1) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // Login
  if (login !== undefined) {
    if (typeof login !== 'string' || login.length < 6) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newStaffOptions.fields.login = login;
  }

  // Password
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length !== 128) {
      return next(new InputError('server.invalid_password'));
    }

    // Hashing password
    newStaffOptions.fields.salt = (crypto.randomBytes(24)).toString('hex');
    newStaffOptions.fields.password = crypto.createHmac('sha512', newStaffOptions.fields.salt)
      .update(password).digest('hex');
  }

  // Name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 3) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newStaffOptions.fields.name = name;
  }

  // Role
  if (role !== undefined) {
    newStaffOptions.fields.role = role;
  }

  // Active
  if (active !== undefined) {
    if (active !== 1 && active !== 0) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newStaffOptions.fields.active = active;
  }

  // Description
  if (description !== undefined) {
    if (typeof description !== 'string') {
      return next(new InputError('server.illegal_patch_data'));
    }

    newStaffOptions.fields.description = description;
  }

  // Email
  if (email !== undefined) {
    if (email.length > 0 && !VALID_EMAIL_REX.test(email)) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newStaffOptions.fields.email = email;
  }

  if (_.isEmpty(newStaffOptions.fields)) {
    return next(new InputError('server.no_one_field_selected'));
  }

  const updatedStaffUser = yield sequelize.updateUser(newStaffOptions);

  // In the second element of response is a number of affected rows
  if (updatedStaffUser[1] === 0) {
    return next(new InputError('server.invalid_staff_id'));
  }

  const result = {
    id,
    login: newStaffOptions.fields.login,
    name: newStaffOptions.fields.name,
    active: newStaffOptions.fields.active,
    role: newStaffOptions.fields.role,
    description: newStaffOptions.fields.description,
    email: newStaffOptions.fields.email,
  };

  logger.log('info', 'Staff updated', result);

  return res.status(httpCodes.OK).send(nullKiller(result));
}).catch(error => next(error));

module.exports = patchStaffs;
