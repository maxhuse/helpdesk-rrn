const express = require('express');
const postAuth = require('./post');
const deleteAuth = require('./delete');
const getAuth = require('./get');
// const patchAuth = require('./patch');
const getUser = require('../../middlewares/get-user');

const auth = express();

auth.post('/', postAuth);
auth.delete('/', deleteAuth);

// this methods require authorization
auth.get('/', getUser, getAuth);
// auth.patch('/', getUser, patchAuth);

module.exports = auth;
