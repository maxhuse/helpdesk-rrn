import { Map } from 'immutable';

export const applicationName: string = 'helpdesk';

// Sidebar menu`s displayed according with this order
export const rights: { [key: string]: string[] } = {
  admin: [
    '/tickets',
    '/customers',
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

type MenuItem = Map<string, string>;
type Menu = Map<string, MenuItem>;

export const menu: Menu = Map({
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
