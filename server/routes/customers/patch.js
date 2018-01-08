const { roles, httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const crypto = require('crypto');
const { VALID_EMAIL_REX } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const _ = require('lodash');
const co = require('co');

const patchCustomers = (req, res, next) => co(function* gen() {
  const id = parseInt(req.params.customerId, 10);
  const { login, name, description, password, email } = req.body;
  const active = req.body.active && parseInt(req.body.active, 10);
  const userRole = req.user.role;

  if (userRole !== roles.ADMIN && userRole !== roles.ENGINEER) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // Validation and creating update object
  const newCustomerOptions = { id, fields: {} };

  // ID
  if (isNaN(newCustomerOptions.id) || newCustomerOptions.id < 1) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // Check that user with this ID has customer role
  const customerDataResult = yield sequelize.getUserById({ id });

  // When don't find user with that ID
  if (!customerDataResult.length || !customerDataResult[0].id) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // If that user not a customer
  if (customerDataResult[0].role !== roles.CUSTOMER) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // Login
  if (login !== undefined) {
    if (typeof login !== 'string' || login.length < 6) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newCustomerOptions.fields.login = login;
  }

  // Password
  if (password !== undefined) {
    if (typeof password !== 'string' || password.length !== 128) {
      return next(new InputError('server.invalid_password'));
    }

    // Hashing password
    newCustomerOptions.fields.salt = (crypto.randomBytes(24)).toString('hex');
    newCustomerOptions.fields.password = crypto.createHmac('sha512', newCustomerOptions.fields.salt)
      .update(password).digest('hex');
  }

  // Name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 3) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newCustomerOptions.fields.name = name;
  }

  // Active
  if (active !== undefined) {
    if (active !== 1 && active !== 0) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newCustomerOptions.fields.active = active;
  }

  // Description
  if (description !== undefined) {
    newCustomerOptions.fields.description = description;
  }

  // Email
  if (email !== undefined) {
    if (email.length > 0 && !VALID_EMAIL_REX.test(email)) {
      return next(new InputError('server.illegal_patch_data'));
    }

    newCustomerOptions.fields.email = email;
  }

  if (_.isEmpty(newCustomerOptions.fields)) {
    return next(new InputError('server.no_one_field_selected'));
  }

  const updatedCustomer = yield sequelize.updateUser(newCustomerOptions);

  // In the second element of response is a number of affected rows
  if (updatedCustomer[1] === 0) {
    return next(new InputError('server.invalid_customer_id'));
  }

  const result = {
    id,
    login: newCustomerOptions.fields.login,
    name: newCustomerOptions.fields.name,
    active: newCustomerOptions.fields.active,
    description: newCustomerOptions.fields.description,
    email: newCustomerOptions.fields.email,
  };

  logger.log('info', 'Customer updated', result);

  return res.status(httpCodes.OK).send(nullKiller(result));
}).catch(error => next(error));

module.exports = patchCustomers;
