const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./../config');
const { httpCodes } = require('./../constants');
const { sequelize } = require('./../sequelize');
const SessionStore = require('connect-session-sequelize')(session.Store);

// Middlewares
const getUser = require('./../middlewares/get-user');
const errorMiddleware = require('./../middlewares/error');

// Routes
const authRoute = require('./auth/index');
const customersRoute = require('./customers/index');
const staffsRoute = require('./staffs/index');

const api = express();

// Configure sessions
const sessionConfig = config.session;

// Create the session store object
sessionConfig.store = new SessionStore({ db: sequelize });
// It will create database for sessions
sessionConfig.store.sync();

// Basic middlewares
api.use(session(sessionConfig));
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

// Routes
api.use('/auth', authRoute); // Methods GET and PATCH here are required auth

// Check authorization and get user fields
api.use(getUser);

// Routes that require authorization
api.use('/customers', customersRoute);
api.use('/staffs', staffsRoute);

// 404 middleware (401 for unauthorized)
api.use('*', (req, res) => {
  // Unauthorized user
  if (!req.session.user || !req.session.user.id) {
    return res.status(httpCodes.UNAUTHORIZED).send({});
  }

  return res.status(httpCodes.NOT_FOUND).send({});
});

// Error-handler middleware
api.use(errorMiddleware);

module.exports = api;
