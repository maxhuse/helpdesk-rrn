const express = require('express');
const getStaffs = require('./get');
const postStaffs = require('./post');
const patchStaffs = require('./patch');

const staffs = express();

staffs.get('/', getStaffs);
staffs.post('/', postStaffs);
staffs.patch('/:staffId', patchStaffs);

module.exports = staffs;
