const nullKiller = require('../../helpers/null-killer');
const { httpCodes } = require('../../constants');
const { roles } = require('../../../shared/constants');
const sequelize = require('../../sequelize');
const co = require('co');

const getMessages = (req, res, next) => co(function* gen() {
  const { role, id: userId } = req.user;
  const { ticket: ticketId } = req.query;

  if (role !== roles.ADMIN && role !== roles.ENGINEER && role !== roles.CUSTOMER) {
    // access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // Customer can get messages only for his tickets
  if (role === roles.CUSTOMER) {
    const ticket = yield sequelize.getTicketById({ id: ticketId });

    if (userId !== ticket[0].customerId) {
      return res.status(httpCodes.FORBIDDEN).send({});
    }
  }

  const messages = yield sequelize.getMessagesForTicket({ id: ticketId });

  return res.status(httpCodes.OK).send(nullKiller(messages));
}).catch(error => next(error));

module.exports = getMessages;
