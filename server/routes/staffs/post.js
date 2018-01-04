const { roles, httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const crypto = require('crypto');
const { VALID_EMAIL_REX } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const co = require('co');

const postStaffs = (req, res, next) => co(function* gen() {
  const { login, name, role, email } = req.body;
  let { description, password } = req.body;
  const salt = (crypto.randomBytes(24)).toString('hex');
  const userRole = req.user ? req.user.role : false;
  const active = Number(req.body.active);

  if (userRole !== roles.ADMIN) {
    // Access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // validate post required params
  let isValidInputData = true;

  if (typeof login !== 'string' || login.length < 6) {
    isValidInputData = false;
  } else if (typeof password !== 'string' || password.length !== 128) {
    isValidInputData = false;
  } else if (typeof name !== 'string' || name.length < 3) {
    isValidInputData = false;
  } else if (role !== roles.ENGINEER && role !== roles.ADMIN) {
    isValidInputData = false;
  } else if (typeof email !== 'string' ||
    (email.length > 0 && !VALID_EMAIL_REX.test(email))
  ) {
    isValidInputData = false;
  } else if (active !== 1 && active !== 0) {
    isValidInputData = false;
  }

  if (!isValidInputData) {
    return next(new InputError('server.illegal_post_data'));
  }

  // optional parameters
  if (typeof description !== 'string') {
    description = '';
  }

  // hashing password
  password = crypto.createHmac('sha512', salt).update(password).digest('hex');

  const options = {
    login,
    password,
    name,
    description,
    role,
    salt,
    email,
    active,
  };

  const newStaff = yield sequelize.addStaffUsers(options);

  const responseFields = {
    id: newStaff.insertId,
    login: options.login,
    name: options.name,
    description: options.description,
    role: options.role,
    email: options.email,
    active: options.active,
  };

  logger.log('info', 'Staff added', responseFields);

  return res.status(httpCodes.OK).send(nullKiller(responseFields));
}).catch(error => next(error));

module.exports = postStaffs;
