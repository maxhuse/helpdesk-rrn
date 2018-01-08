const express = require('express');
const getCustomers = require('./get');
const postCustomers = require('./post');
const patchCustomers = require('./patch');

const customers = express();

customers.get('/', getCustomers);
customers.post('/', postCustomers);
customers.patch('/:customerId', patchCustomers);

module.exports = customers;
