const nullKiller = require('../../helpers/null-killer');
const { httpCodes } = require('../../constants');
const { roles } = require('../../../shared/constants');
const sequelize = require('../../sequelize');
const co = require('co');

const getStaffs = (req, res, next) => co(function* gen() {
  const { role } = req.user;

  if (role !== roles.ADMIN) {
    // access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  const staffs = yield sequelize.getStaffUsers();

  return res.status(httpCodes.OK).send(nullKiller(staffs));
}).catch(error => next(error));

module.exports = getStaffs;
