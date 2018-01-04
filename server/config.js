const path = require('path');

module.exports = {
  session: {
    secret: 'it`s our secret',
    resave: false,
    maxAge: null,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: null,
    },
  },
  logsDir: './logs',
  sequelize: {
    dialect: 'sqlite',
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
    storage: path.resolve(__dirname, '../sql/_helpdesk.sqlite'),
    logging: false,
  },
};
