import { Map } from 'immutable';

export const applicationName = 'helpdesk';

// Sidebar menu`s displayed according with this order
export const rights = {
  admin: [
    // '/customers',
    '/staffs',
    '/profile',
  ],

  customer: [
    '/tickets',
    '/profile',
  ],

  engineer: [
    '/tickets',
    '/customers',
    '/profile',
  ],
};

export const menu = Map({
  '/tickets': Map({
    icon: 'dvr',
    text: 'tickets',
  }),
  '/customers': Map({
    icon: 'group',
    text: 'customers',
  }),
  '/staffs': Map({
    icon: 'directions_run',
    text: 'staffs',
  }),
  '/profile': Map({
    icon: 'account_box',
    text: 'profile',
  }),
});
