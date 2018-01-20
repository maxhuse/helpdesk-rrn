import { List } from 'immutable';

export const ITEMS_PER_PAGE_OPTIONS = List([10, 20, 30, 50, 100, 200, 500]);

export const sortType = {
  ARITHMETIC: 'arithmetic',
  ALPHABETIC: 'alphabetic',
};

export const sortOrder = {
  ASC: 'asc',
  DESC: 'desc',
};

export const filterType = {
  TEXT: 'text',
  SELECT: 'select',
  AUTOCOMPLETE: 'autocomplete',
  DATE_INTERVAL: 'dateInterval',
  CHECKBOX: 'checkbox',
};
