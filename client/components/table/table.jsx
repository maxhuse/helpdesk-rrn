import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { isFunction as _isFunction } from 'lodash';
import Tooltip from 'components/tooltip';
import IconButton from 'components/icon-button';
import Filter from 'components/filter';
import { TableRow } from './row';
import { TableHeader } from './header';
import Pagination from './pagination';

const EmptyTableContent = ({ isEmpty }) => (
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

const CreateButton = ({ onClick }) => (
  <button className="button button_flat button_flat_blue" onClick={onClick}>
    {i18next.t('add')}
  </button>
);

const IconLink = ({ title, icon, href }) => (
  <a title={title} href={href}>
    <button className="button button_flat button_icon">
      <i className="material-icons">{icon}</i>
    </button>
  </a>
);

const FilterButton = ({ filter }) => {
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
            className={isFiltered ? 'button_flat_blue' : false}
          />
        </Tooltip> :
        null
      }
    </div>
  );
};

const ActionButtons = ({ buttons }) => (
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

const ControlButtons = ({ filter, actionButtons }) => (
  <Fragment>
    <ActionButtons buttons={actionButtons} />
    <FilterButton filter={filter} />
  </Fragment>
);

const TableContent = ({
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

export default class Table extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filteredItems: this.filter(props.items, props.tableComponentIm.get('filters')),
    };

    // Extract filter functions from filterFields
    this.filterFunctions = {};

    props.filterFields.forEach((filterField) => {
      if (_isFunction(filterField.filterFunction)) {
        this.filterFunctions[filterField.key] = filterField.filterFunction;
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items ||
      nextProps.tableComponentIm.get('filters') !== this.props.tableComponentIm.get('filters')
    ) {
      this.setState({
        filteredItems: this.filter(nextProps.items, nextProps.tableComponentIm.get('filters')),
      });
    }
  }

  componentWillUnmount() {
    const { isPreventReset, tableComponentResetDelta } = this.props;

    if (!isPreventReset) {
      tableComponentResetDelta();
    }
  }

  sort(items, sort) {
    const type = sort.get('type');
    const field = sort.get('field');
    const order = sort.get('order');

    switch (type) {
      case 'arithmetic': {
        return items.sort((a, b) => {
          const fieldA = a.get(field);
          const fieldB = b.get(field);

          if (order === 'asc') {
            return fieldA - fieldB;
          }
          return fieldB - fieldA;
        });
      }

      case 'alphabetic': {
        return items.sort((a, b) => {
          const fieldA = a.get(field);
          const fieldB = b.get(field);

          if (order === 'asc') {
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

  filter(items, filters) {
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
      tableComponentIm,
      actionButtons,
      tableComponentChangePageDelta,
      tableComponentChangeItemsPerPageDelta,
      tableComponentSortChangeDelta,
      tableComponentOpenRowDelta,
      tableComponentCloseRowDelta,
      tableComponentChangeFiltersDelta,
      tableComponentResetFiltersDelta,
      defaultSort,
    } = this.props;

    const sort = tableComponentIm.get('sort');
    const page = tableComponentIm.get('page');
    const itemsPerPage = tableComponentIm.get('itemsPerPage');
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
    const shownCells = cells.filter(cell => cell.isHiddenOnClosed !== true);

    return (
      <div className="table">
        <div className="table__controls">
          <div className="table__controls-buttons">
            {createButton ? <CreateButton onClick={createButton.onClick} /> : null}
          </div>
          <div className="table__controls-buttons">
            <ControlButtons
              actionButtons={actionButtons}
              filter={{
                changeAction: tableComponentChangeFiltersDelta,
                resetAction: tableComponentResetFiltersDelta,
                filterFields,
                filters: tableComponentIm.get('filters'),
              }}
            />
          </div>
        </div>

        {showHeader && filteredItems.size > 0 ?
          <TableHeader
            cells={shownCells}
            sortChangeAction={tableComponentSortChangeDelta}
            currentSort={sort}
          /> :
          null
        }
        {filteredItems.size > 0 ?
          <TableContent
            items={slicedItems}
            row={row}
            cells={cells}
            shownCells={shownCells}
            openedId={tableComponentIm.get('openedId')}
            isRowsLocked={tableComponentIm.get('isRowsLocked')}
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
