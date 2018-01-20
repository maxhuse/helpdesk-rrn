module.exports = {
  // проверка валидного email
  VALID_EMAIL_REX: /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@[-a-z0-9~!$%^&*_=+}{'?]{2,}\.([a-z]{2,10})$/i,
  roles: {
    ADMIN: 'admin',
    ENGINEER: 'engineer',
    CUSTOMER: 'customer',
  },
  ticketStatus: {
    NEW: 'new',
    ASSIGNED: 'assigned',
    PENDING: 'pending',
    CLOSED: 'closed',
  },
};
