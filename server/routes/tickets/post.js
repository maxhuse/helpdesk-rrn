const { httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const { roles, ticketStatus } = require('../../../shared/constants');
const nullKiller = require('../../helpers/null-killer');
const co = require('co');
const i18next = require('i18next');
const moment = require('moment');

const postTickets = (req, res, next) => co(function* gen() {
  let { subject, message } = req.body;
  const { id: userId, role: userRole } = req.user;


  if (userRole !== roles.CUSTOMER) {
    // Access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  if (typeof subject !== 'string') {
    subject = '';
  }

  if (typeof message !== 'string') {
    message = '';
  }

  const newTicketFields = {
    customerId: userId,
    status: ticketStatus.NEW,
    creationDate: moment().unix(), // current date in seconds
    subject,
    message,
  };

  const addTicketTransactionResult = yield sequelize.addTicketTransaction(newTicketFields);

  const newTicketId = addTicketTransactionResult.ticketId;

  // In the first element of response is ID of new ticket
  if (newTicketId === 0 || newTicketId === undefined) {
    logger.log('error', i18next.t('server.invalid_ticket_id'));
  }

  const responseFields = {
    id: newTicketId,
    customerId: newTicketFields.customerId,
    status: newTicketFields.status,
    creationDate: newTicketFields.creationDate,
    subject: newTicketFields.subject,
    message: newTicketFields.message,
  };

  logger.log('info', 'Ticket added', responseFields);

  return res.status(httpCodes.OK).send(nullKiller(responseFields));
}).catch(error => next(error));

module.exports = postTickets;
