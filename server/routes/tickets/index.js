const express = require('express');
const getTickets = require('./get');
const postTickets = require('./post');

const tickets = express();

tickets.get('/', getTickets);
tickets.post('/', postTickets);

module.exports = tickets;
