const express = require('express');
const getTickets = require('./get');
const postTickets = require('./post');
const patchTickets = require('./patch');

const tickets = express();

tickets.get('/', getTickets);
tickets.post('/', postTickets);
tickets.patch('/:ticketId', patchTickets);

module.exports = tickets;
