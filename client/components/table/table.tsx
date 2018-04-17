import React, { PureComponent, Fragment, StatelessComponent } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { isFunction as _isFunction } from 'lodash';
import { Map } from 'immutable';
import Tooltip from 'components/tooltip';
import IconButton from 'components/icon-button';
import Filter from 'components/filter';
import {
  actions as tableActions,
  TState as TTableState,
  TSort as TTableSort,
} from 'ducks/components/table';
import { sortType, sortOrder, filterType } from 'client-constants';
import { TableRow } from './row';
import { TableHeader } from './header';
import Pagination from './pagination';
import {
  TCells,
  TRow,
  TItems,
  TFilterFields,
  TActionButtons,
  TCreateButton,
  TControlButtonsFilter
} from './types';

/* Components */
interface IEmptyTableContentProps {
  isEmpty: boolean;
}
const EmptyTableContent: StatelessComponent<IEmptyTableContentProps> = ({ isEmpty }) => (
  <div className="empty-table">
    <i className="material-icons empty-table__icon">sentiment_dissatisfied</i>
    <div className="empty-table__title">
      {isEmpty ? i18next.t('no_data_here') : i18next.t('filter_results_empty')}
    </div>
    {isEmpty ?
      null :
      <div className="empty-table__text">{i18next.t('change_filter_parameters')}</div>
    }
  </div>
);

interface ICreateButtonProps {
  onClick: () => void;
  text?: string;
}
const CreateButton: StatelessComponent<ICreateButtonProps> = ({ onClick, text }) => (
  <button className="button button_flat button_flat_blue" onClick={onClick}>
    {i18next.t(text || 'add')}
  </button>
);

interface IIconLinkProps {
  title: string;
  icon: string;
  href: string;
}
const IconLink: StatelessComponent<IIconLinkProps> = ({ title, icon, href }) => (
  <a title={title} href={href}>
    <button className="button button_flat button_icon">
      <i className="material-icons">{icon}</i>
    </button>
  </a>
);

interface IFilterButtonProps {
  filter: TControlButtonsFilter;
}
const FilterButton: StatelessComponent<IFilterButtonProps> = ({ filter }) => {
  const { changeAction, resetAction, filterFields, filters } = filter;

  const filterBlock = (
    <Filter
      changeAction={changeAction}
      resetAction={resetAction}
      filterFields={filterFields}
      filters={filters}
    />
  );

  const isFiltered = filters.size > 0;

  return (
    <div className="table__action-buttons">
      {filterFields ?
        <Tooltip
          content={filterBlock}
          className="tooltip__content_filter"
        >
          <IconButton
            title={i18next.t('filter')}
            icon="filter_list"
            className={isFiltered ? 'button_flat_blue' : undefined}
          />
        </Tooltip> :
        null
      }
    </div>
  );
};

interface IActionButtonsProps {
  buttons?: TActionButtons;
}
const ActionButtons: StatelessComponent<IActionButtonsProps> = ({ buttons }) => (
  <div className="table__action-buttons">
    {buttons ?
      <div className="table__action-buttons">
        {buttons.map((button) => {
          if (button.type === 'link') {
            return (
              <IconLink
                icon={button.icon}
                title={button.title}
                href={button.href}
                key={button.id}
              />
            );
          }

          return (
            <IconButton
              icon={button.icon}
              title={button.title}
              onClick={button.onClick}
              key={button.id}
            />
          );
        })}
      </div> :
      null
    }
  </div>
);

interface IControlButtonsProps {
  actionButtons?: TActionButtons;
  filter: TControlButtonsFilter;
}
const ControlButtons: StatelessComponent<IControlButtonsProps> = ({ filter, actionButtons }) => (
  <Fragment>
    <ActionButtons buttons={actionButtons} />
    <FilterButton filter={filter} />
  </Fragment>
);

interface ITableContentProps {
  items: TItems;
  cells: TCells;
  row: TRow;
  shownCells: TCells;
  openedId: false | number;
  isRowsLocked: boolean;
  openRowAction: typeof tableActions.tableComponentOpenRowDelta;
  closeRowAction: typeof tableActions.tableComponentCloseRowDelta;
}
const TableContent: StatelessComponent<ITableContentProps> = ({
  items,
  row,
  cells,
  shownCells,
  openedId,
  isRowsLocked,
  openRowAction,
  closeRowAction,
}) => (
  <Fragment>
    {items.map(item => (
      <TableRow
        {...row}
        key={item.get('id')}
        cells={cells}
        shownCells={shownCells}
        item={item}
        openedId={openedId}
        isRowsLocked={isRowsLocked}
        openRowAction={openRowAction}
        closeRowAction={closeRowAction}
        disabled={item.get('active') === undefined ? false : item.get('active') === 0}
      />
    ))}
  </Fragment>
);

interface ITableProps {
  isPreventReset?: boolean;
  cells: TCells;
  row: TRow;
  items: TItems;
  filterFields: TFilterFields;
  showHeader?: boolean;
  actionButtons?: TActionButtons;
  createButton?: TCreateButton;
  defaultSort?: TTableSort;
  tableComponentIm: TTableState;
  tableComponentResetDelta: typeof tableActions.tableComponentResetDelta;
  tableComponentChangePageDelta: typeof tableActions.tableComponentChangePageDelta;
  tableComponentChangeItemsPerPageDelta: typeof tableActions.tableComponentChangeItemsPerPageDelta;
  tableComponentOpenRowDelta: typeof tableActions.tableComponentOpenRowDelta;
  tableComponentCloseRowDelta: typeof tableActions.tableComponentCloseRowDelta;
  tableComponentResetFiltersDelta: typeof tableActions.tableComponentResetFiltersDelta;
  tableComponentChangeFiltersDelta: typeof tableActions.tableComponentChangeFiltersDelta;
}
interface ITableState {
  filteredItems: TItems;
}
class Table extends PureComponent<ITableProps, ITableState> {
  readonly filterFunctions: {
    [key: string]:
      (options: {
      model: Map<string, any>,
      fieldName: string,
      value: string | number | boolean
      }) => boolean
  };

  constructor(props) {
    super(props);

    this.state = {
      filteredItems: this.filter(props.items, props.tableComponentIm.filters),
    };

    // Extract filter functions from filterFields
    this.filterFunctions = {};

    props.filterFields.forEach((filterField) => {
      // If the filter type is dateInterval, we use specific filter function
      if (filterField.type === filterType.DATE_INTERVAL) {
        this.filterFunctions[filterField.key] = this.dateIntervalFilterFunction;
      }

      if (_isFunction(filterField.filterFunction)) {
        this.filterFunctions[filterField.key] = filterField.filterFunction;
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items ||
      nextProps.tableComponentIm.get('filters') !== this.props.tableComponentIm.filters
    ) {
      this.setState({
        filteredItems: this.filter(nextProps.items, nextProps.tableComponentIm.filters),
      });
    }
  }

  componentWillUnmount() {
    const { isPreventReset, tableComponentResetDelta } = this.props;

    if (!isPreventReset) {
      tableComponentResetDelta();
    }
  }

  private sort(items: TItems, sort): TItems {
    const type = sort.get('type');
    const field = sort.get('field');
    const order = sort.get('order');

    switch (type) {
      case sortType.ARITHMETIC: {
        return items.sort((a, b) => {
          const fieldA = a.get(field);
          const fieldB = b.get(field);

          if (order === sortOrder.ASC) {
            return fieldA - fieldB;
          }
          return fieldB - fieldA;
        });
      }

      case sortType.ALPHABETIC: {
        return items.sort((a, b) => {
          const fieldA = a.get(field);
          const fieldB = b.get(field);

          if (order === sortOrder.ASC) {
            if (fieldA === '' && fieldB !== '') return 1;
            if (fieldB === '' && fieldA !== '') return -1;
            if (fieldA < fieldB) return -1;
            if (fieldA > fieldB) return 1;
          }

          if (fieldA === '' && fieldB !== '') return -1;
          if (fieldB === '' && fieldA !== '') return 1;
          if (fieldA > fieldB) return -1;
          if (fieldA < fieldB) return 1;

          return 0;
        });
      }

      default: {
        // Unknown sort type
        return items;
      }
    }
  }

  // Filter function for 'dateInterval' filter
  private dateIntervalFilterFunction({ model, fieldName, value }): boolean {
    const fieldValue = model.get(fieldName);
    const fromTimestamp = Number(value[0]);
    const toTimestamp = Number(value[1]);
    const fieldValueTimestamp = Number(fieldValue);

    if (fromTimestamp && toTimestamp) {
      return (fromTimestamp <= fieldValueTimestamp) && (fieldValueTimestamp <= toTimestamp);
    } else if (fromTimestamp) {
      return fromTimestamp <= fieldValueTimestamp;
    } else if (toTimestamp) {
      return fieldValueTimestamp <= toTimestamp;
    }

    return true;
  }

  public filter(items: TItems, filters): TItems {
    if (!filters || !filters.size) {
      return items;
    }

    return items.filter((model) => {
      let isFiltered = true;

      /* eslint consistent-return: "off" */
      filters.forEach((value, fieldName) => {
        // If there is specific filter function - use it
        const specificFilterFunction = this.filterFunctions[fieldName];

        if (specificFilterFunction) {
          isFiltered = specificFilterFunction({ model, fieldName, value });

          return;
        }

        // Else use default filters
        const fieldValue = model.get(fieldName);

        // If model value is string then check if it contains filter value
        if (typeof fieldValue === 'string') {
          if (fieldValue.toLowerCase().indexOf(value.toLowerCase()) === -1) {
            isFiltered = false;
          }

          return;
        }

        // If model value has other type
        // eslint-disable-next-line eqeqeq
        if (fieldValue != value) {
          isFiltered = false;
        }
      });

      return isFiltered;
    });
  }

  render() {
    const {
      cells,
      row,
      filterFields,
      showHeader,
      items,
      createButton,
      actionButtons,
      defaultSort,
      tableComponentIm,
      tableComponentChangePageDelta,
      tableComponentChangeItemsPerPageDelta,
      tableComponentOpenRowDelta,
      tableComponentCloseRowDelta,
      tableComponentChangeFiltersDelta,
      tableComponentResetFiltersDelta,
    } = this.props;

    const { sort, page, itemsPerPage } = tableComponentIm;
    let { filteredItems } = this.state;

    // Sorting
    if (!sort.isEmpty()) {
      filteredItems = this.sort(filteredItems, sort);
    } else if (defaultSort && !defaultSort.isEmpty()) {
      filteredItems = this.sort(filteredItems, defaultSort);
    }

    // Pagination
    const paginationStart = (page - 1) * itemsPerPage;
    const paginationEnd = paginationStart + itemsPerPage;
    let slicedItems;

    if (filteredItems.size > itemsPerPage) {
      slicedItems = filteredItems.slice(paginationStart, paginationEnd);
    } else {
      slicedItems = filteredItems;
    }

    // This cells shows when row is not opened
    const shownCells = cells.filter(cell => !cell.isHiddenOnClosed);

    return (
      <div className="table">
        <div className="table__controls">
          <div className="table__controls-buttons">
            {createButton ?
              <CreateButton text={createButton.text} onClick={createButton.onClick} /> :
              null
            }
          </div>
          <div className="table__controls-buttons">
            <ControlButtons
              actionButtons={actionButtons}
              filter={{
                changeAction: tableComponentChangeFiltersDelta,
                resetAction: tableComponentResetFiltersDelta,
                filterFields,
                filters: tableComponentIm.filters,
              }}
            />
          </div>
        </div>

        {showHeader && filteredItems.size > 0 ?
          <TableHeader cells={shownCells} currentSort={sort} /> :
          null
        }
        {filteredItems.size > 0 ?
          <TableContent
            items={slicedItems}
            row={row}
            cells={cells}
            shownCells={shownCells}
            openedId={tableComponentIm.openedId}
            isRowsLocked={tableComponentIm.isRowsLocked}
            openRowAction={tableComponentOpenRowDelta}
            closeRowAction={tableComponentCloseRowDelta}
          /> :
          <EmptyTableContent isEmpty={items.size === 0} />
        }

        {filteredItems.size > 0 ?
          <div className="table__footer">
            <Pagination
              changePage={tableComponentChangePageDelta}
              currentPage={page}
              itemsCount={filteredItems.size}
              itemsPerPage={itemsPerPage}
              changeItemsPerPage={tableComponentChangeItemsPerPageDelta}
            />
          </div> :
          null
        }
      </div>
    );
  }
}

const mapDispatchToProps = {
  tableComponentResetDelta: tableActions.tableComponentResetDelta,
  tableComponentChangePageDelta: tableActions.tableComponentChangePageDelta,
  tableComponentChangeItemsPerPageDelta: tableActions.tableComponentChangeItemsPerPageDelta,
  tableComponentOpenRowDelta: tableActions.tableComponentOpenRowDelta,
  tableComponentCloseRowDelta: tableActions.tableComponentCloseRowDelta,
  tableComponentResetFiltersDelta: tableActions.tableComponentResetFiltersDelta,
  tableComponentChangeFiltersDelta: tableActions.tableComponentChangeFiltersDelta,
};

const mapStateToProps = state => ({
  tableComponentIm: state.components.tableComponentIm,
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);
