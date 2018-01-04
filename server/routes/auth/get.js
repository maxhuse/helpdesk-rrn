// this module just send user fields from req.user

const { httpCodes } = require('../../constants');
const nullKiller = require('../../helpers/null-killer');

module.exports = (req, res) => {
  const { user } = req;
  const response = {
    id: user.id,
    name: user.name,
    login: user.login,
    role: user.role,
    email: user.email || '',
  };

  return res.status(httpCodes.OK).send(nullKiller(response));
};
