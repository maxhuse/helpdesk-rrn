const { roles, httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const crypto = require('crypto');
const { VALID_EMAIL_REX } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const co = require('co');
const i18next = require('i18next');

const postCustomers = (req, res, next) => co(function* gen() {
  const { login, name, email } = req.body;
  let { description, password } = req.body;
  const salt = (crypto.randomBytes(24)).toString('hex');
  const userRole = req.user.role;
  let active = Number(req.body.active);

  if (userRole !== roles.ADMIN && userRole !== roles.ENGINEER) {
    // Access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // Validate post required params
  let isValidInputData = true;

  if (typeof login !== 'string' || login.length < 6) {
    isValidInputData = false;
  } else if (typeof password !== 'string' || password.length !== 128) {
    isValidInputData = false;
  } else if (typeof name !== 'string' || name.length < 3) {
    isValidInputData = false;
  } else if (typeof email !== 'string' ||
    (email.length > 0 && !VALID_EMAIL_REX.test(email))
  ) {
    isValidInputData = false;
  }

  if (!isValidInputData) {
    return next(new InputError('server.illegal_post_data'));
  }

  // Optional parameters
  if (active !== 1 && active !== 0) {
    active = 0;
  }

  if (typeof description !== 'string') {
    description = '';
  }

  // Hashing password
  password = crypto.createHmac('sha512', salt).update(password).digest('hex');

  const options = {
    login,
    password,
    name,
    description,
    role: roles.CUSTOMER,
    salt,
    email,
    active,
  };

  const newCustomer = yield sequelize.addUser(options);

  // In the second element of response is a number of inserted rows
  if (newCustomer[1] === 0) {
    return next(new InputError('server.illegal_post_data'));
  }

  const newCustomerId = newCustomer[0];

  // In the first element of response is ID of new customer
  if (newCustomerId === 0 || newCustomerId === undefined) {
    logger.log('error', i18next.t('server.invalid_customer_id'));
  }

  const responseFields = {
    id: newCustomerId,
    login: options.login,
    name: options.name,
    description: options.description,
    role: options.role,
    email: options.email,
    active: options.active,
  };

  logger.log('info', 'Customer added', responseFields);

  return res.status(httpCodes.OK).send(nullKiller(responseFields));
}).catch(error => next(error));

module.exports = postCustomers;
