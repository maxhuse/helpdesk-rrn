import { List } from 'immutable';

export const ITEMS_PER_PAGE_OPTIONS: List<number> = List([10, 20, 30, 50, 100, 200, 500]);

export enum sortType {
  ARITHMETIC = 'arithmetic',
  ALPHABETIC ='alphabetic',
}

export enum sortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum filterType {
  TEXT = 'text',
  SELECT = 'select',
  AUTOCOMPLETE = 'autocomplete',
  DATE_INTERVAL = 'dateInterval',
  CHECKBOX = 'checkbox',
}
