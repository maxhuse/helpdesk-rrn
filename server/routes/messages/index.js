const express = require('express');
const getMessages = require('./get');
// const postMessages = require('./post');

const messages = express();

messages.get('/', getMessages);
// messages.post('/', postMessages);

module.exports = messages;
