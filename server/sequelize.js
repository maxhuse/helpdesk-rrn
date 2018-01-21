const Sequelize = require('sequelize');
const config = require('./config');
const { roles } = require('../shared/constants');

const sequelize = new Sequelize(config.sequelize);

/*
* Функция возвращает строку для SET в команде UPDATE
* @param {object} fields - Объект с полями для вставки
* @returns {string} result - Строка для вставки в UPDATE
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

  addUser(options) {
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

  updateUser(options) {
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

  getCustomers() {
    return sequelize.query(
      `SELECT
        id,
        name,
        login,
        role,
        description,
        active,
        email
      FROM users
      WHERE role=:customer`,
      {
        replacements: { customer: roles.CUSTOMER },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  },

  getTickets() {
    return sequelize.query(
      `SELECT
        tickets.id,
        tickets.customer_id AS customerId,
        tickets.status,
        tickets.creation_date AS creationDate,
        tickets.staff_id AS staffId,
        tickets.subject,
        tickets.message,
        customers.name AS customerName
      FROM tickets
      LEFT JOIN users AS customers ON customers.id = tickets.customer_id`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  },

  getTicketsForCustomer(options) {
    const id = sequelize.escape(options.id);

    return sequelize.query(
      `SELECT
        tickets.id,
        tickets.status,
        tickets.creation_date AS creationDate,
        tickets.subject,
        tickets.message
      FROM tickets
      WHERE tickets.customer_id=${id}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  },

  addTicket(options) {
    const customerId = sequelize.escape(options.customerId);
    const status = sequelize.escape(options.status);
    const creationDate = sequelize.escape(options.creationDate);
    const subject = sequelize.escape(options.subject);
    const message = sequelize.escape(options.message);

    return sequelize.query(
      `INSERT INTO tickets VALUES (
        NULL,
        ${customerId},
        ${status},
        ${creationDate},
        NULL,
        ${subject},
        ${message}
      )`,
      {
        type: sequelize.QueryTypes.INSERT,
      }
    );
  },
};
