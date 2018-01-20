const express = require('express');
const getTickets = require('./get');

const tickets = express();

tickets.get('/', getTickets);

module.exports = tickets;
