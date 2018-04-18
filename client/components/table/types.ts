import { List, Map } from 'immutable';
import { ComponentType } from 'react';
import { filterType, sortType } from 'client-constants';
import { actions as tableActions, TFilters as TTableFilters } from 'ducks/components/table';

export type TCell = {
  id: string,
  getValue: (model: any) => any,
  className: string,
  name: string,
  isHiddenOnClosed?: boolean;
  isHiddenOnOpened?: boolean;
  sort?: { type: sortType, field: string };
  component?: ComponentType<any>;
  componentProps?: { [key: string]: any };
};

export type TCells = Array<TCell>;

export type TItem = Map<string, any>;

export type TItems = List<TItem>;

export type TRowButton = {
  getIcon?: (model: TItem) => string;
  getText?: (model: TItem) => string;
  getTitle: (model: TItem) => string;
  getClassName: (model: TItem) => string;
  isShown?: (model: TItem) => boolean;
  onClick: (model: TItem) => void;
};

export type TRowButtons = Array<TRowButton>;

export type TRow = {
  iconButtons: Array<TRowButton>,
  textButtons: Array<TRowButton>,
  onRowClick: (id: string | number) => void;
};

export type TFilterFields = Array<{
  type: filterType,
  key: string,
  name: string,
  options?: any;
  getValue?: (model: any) => any;
  getText?: (model: any) => string;
  getFilteredString?: (model: any) => string;
  placeholder?: string;
  items?: () => any;
}>;

export type TActionButtons = Array<{
  type: string;
  id: string;
  icon: string;
  title: string;
  href: string;
  onClick: () => void;
}>;

export type TCreateButton = { text?: string, onClick: () => void };

export type TControlButtonsFilter = {
  changeAction: typeof tableActions.tableComponentChangeFiltersDelta;
  resetAction: typeof tableActions.tableComponentResetFiltersDelta;
  filterFields: TFilterFields;
  filters: TTableFilters;
};
