const { httpCodes } = require('../../constants');
const sequelize = require('../../sequelize');
const logger = require('../../logger');
const { roles, ticketStatus } = require('../../../shared/constants');
const { InputError } = require('../../errors');
const co = require('co');

const patchTickets = (req, res, next) => co(function* gen() {
  const ticketId = parseInt(req.params.ticketId, 10);
  const { status: newStatus } = req.body;
  const { id: userId, role: userRole } = req.user;

  if (userRole !== roles.ADMIN && userRole !== roles.ENGINEER) {
    return res.status(httpCodes.FORBIDDEN).send({});
  }

  // Validation and creating update object
  const newTicketOptions = { id: ticketId, fields: {} };

  // ID
  if (isNaN(newTicketOptions.id) || newTicketOptions.id < 1) {
    return next(new InputError('server.illegal_patch_data'));
  }

  const ticketResult = yield sequelize.getTicketById({ id: ticketId });
  const ticket = ticketResult[0];

  // From NEW status can only be changed to ASSIGNED
  if (ticket.status === ticketStatus.NEW && newStatus !== ticketStatus.ASSIGNED) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // From ASSIGNED status can only be changed to PENDING or CLOSED
  if (ticket.status === ticketStatus.ASSIGNED &&
    (newStatus !== ticketStatus.PENDING && newStatus !== ticketStatus.CLOSED)
  ) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // From PENDING status can only be changed to ASSIGNED or CLOSED
  if (ticket.status === ticketStatus.PENDING &&
    (newStatus !== ticketStatus.ASSIGNED && newStatus !== ticketStatus.CLOSED)
  ) {
    return next(new InputError('server.illegal_patch_data'));
  }

  // Can't change ticket with CLOSED status
  if (ticket.status === ticketStatus.CLOSED) {
    return next(new InputError('server.illegal_patch_data'));
  }

  newTicketOptions.fields.status = newStatus;

  if (newStatus === ticketStatus.ASSIGNED) {
    newTicketOptions.fields.staff_id = userId;
  } else {
    newTicketOptions.fields.staff_id = null;
  }

  const updatedTicket = yield sequelize.updateTicket(newTicketOptions);

  // In the second element of response is a number of affected rows
  if (updatedTicket[1] === 0) {
    return next(new InputError('server.invalid_ticket_id'));
  }

  const result = {
    id: ticketId,
    status: newTicketOptions.fields.status,
    staffId: newTicketOptions.fields.staff_id,
  };

  if (result.staffId) {
    const userResult = yield sequelize.getUserById({ id: userId });

    result.staffName = userResult[0].name;
  } else {
    result.staffName = null;
  }

  logger.log('info', 'Ticket updated', result);

  return res.status(httpCodes.OK).send(result);
}).catch(error => next(error));

module.exports = patchTickets;
