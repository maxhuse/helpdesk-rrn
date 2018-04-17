import { List, Map } from 'immutable';
import { filterType, sortType } from 'client-constants';
import { actions as tableActions, TFilters as TTableFilters } from 'ducks/components/table';

export type TCells = Array<{
  id: string,
  getValue: (model: any) => any,
  className: string,
  name: string,
  isHiddenOnClosed?: boolean;
  sort?: { type: sortType, field: string }
}>;

export type TRow = {
  iconButtons: Array<{
    getIcon: () => string;
    getTitle: () => string;
    getClassName: () => string;
    onClick: (item: any) => void;
  }>,
  onRowClick: (id: string | number) => void;
};

export type TItems = List<Map<string, any>>;

export type TFilterFields = Array<{
  type: filterType,
  key: string,
  name: string,
  options?: any;
  getValue?: (elem: any) => any;
  getText?: (elem: any) => string;
  getFilteredString?: (elem: any) => string;
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
