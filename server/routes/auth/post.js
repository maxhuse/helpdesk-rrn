const co = require('co');
const crypto = require('crypto');
const sequelize = require('../../sequelize');
const { httpCodes } = require('../../constants');
const { AuthorizeError } = require('../../errors');
const nullKiller = require('../../helpers/null-killer');
const getUser = require('../../middlewares/get-user');
const getAuth = require('./get');

module.exports = (req, res, next) => co(function* generator() {
  // Если пользователь уже авторизован, то направим GET
  if (req.session.user && req.session.user.id) {
    return getUser(req, res, (error) => {
      if (error) {
        next(error);
      }

      getAuth(req, res, next);
    });
  }

  const { login, password } = req.body;

  // When req.body is inappropriate format
  if (typeof login !== 'string') {
    return next(new AuthorizeError('server.invalid_login_or_password'));
  }

  const dbResult = yield sequelize.getUserByLogin({ login });

  // The first element of response is operation result
  if (!dbResult.length || !dbResult[0].id) {
    return next(new AuthorizeError('server.invalid_login_or_password'));
  }

  const user = dbResult[0];
  const passwordHash = crypto.createHmac('sha512', user.salt).update(password).digest('hex');

  if (passwordHash !== user.password) {
    return next(new AuthorizeError('server.invalid_login_or_password'));
  }

  // User is blocked
  if (!user.active) {
    return next(new AuthorizeError('server.user_blocked'));
  }

  // save user in session
  req.session.user = {
    id: user.id,
    role: user.role,
  };

  req.session.save();

  const response = {
    id: user.id,
    name: user.name,
    login: user.login,
    role: user.role,
    email: user.email || '',
  };

  // send OK response
  return res.status(httpCodes.OK).send(nullKiller(response));
}).catch(error => next(error));
