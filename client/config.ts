import { Map, Record } from 'immutable';

export const applicationName: string = 'helpdesk';

// Sidebar menu`s displayed according with this order
export const rights: { [key in 'admin' | 'customer' | 'engineer']: string[] } = {
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

class MenuItem extends Record({ icon: '', text: '' }) {
  icon: string;
  text: string;
}

type TMenu = Map<string, MenuItem>;

export const menu: TMenu = Map({
  '/tickets': new MenuItem({
    icon: 'dvr',
    text: 'tickets',
  }),
  '/customers': new MenuItem({
    icon: 'group',
    text: 'customers',
  }),
  '/staffs': new MenuItem({
    icon: 'directions_run',
    text: 'staffs',
  }),
  '/profile': new MenuItem({
    icon: 'account_box',
    text: 'profile',
  }),
});
