const { httpCodes } = require('../../constants');
const co = require('co');
const sequelize = require('../../sequelize');

module.exports = (req, res, next) => co(function* generator() {
  // unauthorized user
  if (!req.session.user || !req.session.user.id) {
    return res.status(httpCodes.UNAUTHORIZED).send({});
  }

  const isDeleteAllSessions = req.query.all;

  if (!isDeleteAllSessions) {
    // Удаляем только текущуюю сессию
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      return res.status(httpCodes.UNAUTHORIZED).send({});
    });

    return;
  }

  // Удаляем все сессии пользователя
  // Получим все sessions_id пользователя
  const allUserSessionsID = [];
  const allSessions = yield sequelize.getSessions();
  const { id: userId, role: userRole } = req.session.user;

  allSessions.forEach(({ sid, data }) => {
    const { id, role } = JSON.parse(data).user;

    if (id === userId && role === userRole) {
      allUserSessionsID.push(sid);
    }
  });

  // Удалим все сессии через API хранилища
  const destroyPromises = [];

  allUserSessionsID.forEach((sessionId) => {
    const promise = new Promise((resolve, reject) => {
      req.sessionStore.destroy(sessionId, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });

    destroyPromises.push(promise);
  });

  yield Promise.all(destroyPromises);

  return res.status(httpCodes.UNAUTHORIZED).send({});
}).catch(error => next(error));
