const nullKiller = require('../../helpers/null-killer');
const { httpCodes } = require('../../constants');
const { roles } = require('../../../shared/constants');
const sequelize = require('../../sequelize');
const co = require('co');

const getTickets = (req, res, next) => co(function* gen() {
  const { role, id: userId } = req.user;

  if (role !== roles.ADMIN && role !== roles.ENGINEER && role !== roles.CUSTOMER) {
    // access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  const tickets = role === roles.CUSTOMER ?
    yield sequelize.getTicketsForCustomer({ id: userId }) :
    yield sequelize.getTickets();

  return res.status(httpCodes.OK).send(nullKiller(tickets));
}).catch(error => next(error));

module.exports = getTickets;
