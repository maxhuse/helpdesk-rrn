const nullKiller = require('../../helpers/null-killer');
const { httpCodes } = require('../../constants');
const { roles } = require('../../../shared/constants');
const sequelize = require('../../sequelize');
const co = require('co');

const getCustomers = (req, res, next) => co(function* gen() {
  const { role } = req.user;

  if (role !== roles.ADMIN && role !== roles.ENGINEER) {
    // Access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  const customers = yield sequelize.getCustomers();

  return res.status(httpCodes.OK).send(nullKiller(customers));
}).catch(error => next(error));

module.exports = getCustomers;
