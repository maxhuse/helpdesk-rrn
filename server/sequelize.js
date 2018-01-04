const Sequelize = require('sequelize');
const config = require('./config');
const { roles } = require('./constants');

const sequelize = new Sequelize(config.sequelize);

/*
* Функция возвращает строку для SET в команде UPDATE
* @param {object} fields - Объект с полями для вставки
* @return {string} result - Строка для вставки в UPDATE
* */
const generateUpdateFields = (fields) => {
  let result = '';

  Object.keys(fields).forEach((key, index) => {
    if (index > 0) {
      result += ',';
    }

    result += `${key}=${sequelize.escape(fields[key])}`;
  });

  return result;
};

module.exports = {
  sequelize,

  getUserByLogin(options) {
    const login = sequelize.escape(options.login);

    return sequelize.query(
      `SELECT         
        id,
        name,
        login,
        password,
        role,
        description,
        salt,
        active,
        email
      FROM users 
      WHERE login=${login} LIMIT 1`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  },

  getUserById(options) {
    const id = sequelize.escape(options.id);

    return sequelize.query(
      `SELECT 
        id,
        name,
        login,
        password,
        role,
        description,
        active,
        email
      FROM users 
      WHERE id=${id} LIMIT 1`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  },

  getSessions() {
    return sequelize.query('SELECT * FROM sessions', {
      type: sequelize.QueryTypes.SELECT,
    });
  },

  getStaffUsers() {
    return sequelize.query(
      `SELECT 
        id,
        name,
        login,
        password,
        role,
        description,
        active,
        email
      FROM users 
      WHERE role=:admin OR role=:engineer`,
      {
        replacements: { admin: roles.ADMIN, engineer: roles.ENGINEER },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  },

  addStaffUsers(options) {
    const login = sequelize.escape(options.login);
    const password = sequelize.escape(options.password);
    const name = sequelize.escape(options.name);
    const description = options.description.length ? sequelize.escape(options.description) : 'NULL';
    const role = sequelize.escape(options.role);
    const salt = sequelize.escape(options.salt);
    const email = options.email.length ? sequelize.escape(options.email) : 'NULL';
    const active = sequelize.escape(options.active);

    return sequelize.query(
      `INSERT INTO users VALUES ( 
        NULL,
        ${name},
        ${login},
        ${password},
        ${role},
        ${description},
        ${salt},
        ${active},
        ${email}
      )`,
      {
        type: sequelize.QueryTypes.INSERT,
      }
    );
  },

  updateStaffUser(options) {
    const id = sequelize.escape(options.id);
    const fields = generateUpdateFields(options.fields);

    return sequelize.query(
      `UPDATE users 
        SET ${fields}
        WHERE id=${id}
      `,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
  },
};
