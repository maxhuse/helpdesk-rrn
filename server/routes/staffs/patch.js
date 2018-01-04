const { roles, httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const crypto = require('crypto');
const { VALID_EMAIL_REX } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const _ = require('lodash');
const co = require('co');

const patchStaffs = (req, res, next) => co(function* gen() {
  const id = parseInt(req.params.staffId, 10);
  const { login, name, role, description, password, email } = req.body;
  const active = req.body.active && parseInt(req.body.active, 10);

  // only admins able to edit staffs
  if (req.user.role !== roles.ADMIN) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // validation and creating update object
  const staffOptions = { id, fields: {} };

  // id
  if (isNaN(staffOptions.id) || staffOptions.id < 1) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // login
  if (login !== undefined) {
    if (typeof login !== 'string' || login.length < 6) {
      return next(new InputError('server.illegal_patch_data'));
    }

    staffOptions.fields.login = login;
  }

  // password
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length !== 128) {
      return next(new InputError('server.invalid_password'));
    }

    // hashing password
    staffOptions.fields.salt = (crypto.randomBytes(24)).toString('hex');
    staffOptions.fields.password = crypto.createHmac('sha512', staffOptions.fields.salt)
      .update(password).digest('hex');
  }

  // name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 3) {
      return next(new InputError('server.illegal_patch_data'));
    }

    staffOptions.fields.name = name;
  }

  // role
  if (role !== undefined) {
    staffOptions.fields.role = role;
  }

  // active
  if (active !== undefined) {
    if (active !== 1 && active !== 0) {
      return next(new InputError('server.illegal_patch_data'));
    }

    staffOptions.fields.active = active;
  }

  // description
  if (description !== undefined) {
    staffOptions.fields.description = description;
  }

  // email
  if (email !== undefined) {
    if (email.length > 0 && !VALID_EMAIL_REX.test(email)) {
      return next(new InputError('server.illegal_patch_data'));
    }

    staffOptions.fields.email = email;
  }

  if (_.isEmpty(staffOptions.fields)) {
    return next(new InputError('server.no_one_field_selected'));
  }

  const updatedStaffUser = yield sequelize.updateStaffUser(staffOptions);

  // Во втором элементе ответа число affected rows
  if (updatedStaffUser[1] === 0) {
    return next(new InputError('server.invalid_staff_user_id'));
  }

  const result = {
    id: staffOptions.id,
    login: staffOptions.fields.login,
    name: staffOptions.fields.name,
    active: staffOptions.fields.active,
    role: staffOptions.fields.role,
    description: staffOptions.fields.description,
    email: staffOptions.fields.email,
  };

  logger.log('info', 'Staff updated', result);

  return res.status(httpCodes.OK).send(nullKiller(result));
}).catch(error => next(error));

module.exports = patchStaffs;
