const { httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const { roles, ticketStatus } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const co = require('co');
const i18next = require('i18next');
const moment = require('moment');

const postMessages = (req, res, next) => co(function* gen() {
  const { ticketId, text } = req.body;
  const { id: userId, role: userRole } = req.user;
  const date = moment().unix(); // current date in seconds

  if (userRole !== roles.ADMIN && userRole !== roles.ENGINEER && userRole !== roles.CUSTOMER) {
    // Access denied
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  if (typeof text !== 'string' || text.length === 0) {
    return next(new InputError('server.illegal_post_data'));
  }

  const ticketResult = yield sequelize.getTicketById({ id: ticketId });
  const ticket = ticketResult[0];

  // Customer can send messages only for his tickets
  if (userRole === roles.CUSTOMER && userId !== ticket.customerId) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // Engineer can send messages to tickets that are assigned to him
  if (userRole === roles.ENGINEER && userId !== ticket.staffId) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // No one can send message to the closed ticket
  if (ticket.status === ticketStatus.CLOSED) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  const options = {
    userId,
    ticketId,
    date,
    text,
  };

  const newMessage = yield sequelize.addMessage(options);

  // In the second element of response is a number of inserted rows
  if (newMessage[1] === 0) {
    return next(new InputError('server.illegal_post_data'));
  }

  const newMessageId = newMessage[0];

  // In the first element of response is ID of new message
  if (newMessageId === 0 || newMessageId === undefined) {
    logger.log('error', i18next.t('server.invalid_message_id'));
  }

  const userResult = yield sequelize.getUserById({ id: userId });
  const user = userResult[0];

  const responseFields = {
    id: newMessageId,
    userId: options.userId,
    userName: user.name,
    ticketId: options.ticketId,
    date: options.date,
    text: options.text,
  };

  logger.log('info', 'Message added', responseFields);

  return res.status(httpCodes.OK).send(nullKiller(responseFields));
}).catch(error => next(error));

module.exports = postMessages;
