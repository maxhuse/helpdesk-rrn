import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { sortOrder } from 'client-constants';
import { actions as tableActions, TSort } from 'ducks/components/table';
import { TableCell } from './cell';
import { TCells } from './types';

const mapDispatchToProps = {
  tableComponentSortChangeSignal: tableActions.tableComponentSortChangeSignal,
};

interface IProps {
  currentSort: TSort;
  cells: TCells;
  tableComponentSortChangeSignal: typeof tableActions.tableComponentSortChangeSignal;
}
class TableHeaderInner extends PureComponent<IProps> {
  getContent(cell) {
    const { tableComponentSortChangeSignal, currentSort } = this.props;

    let className = 'table__header-text';
    let onClick;

    if (cell.sort) {
      const currentOrder = currentSort.get('order');
      let order = sortOrder.ASC;
      let sortArrow = '';

      if (currentSort.get('field') === cell.sort.field) {
        order = currentOrder === sortOrder.ASC ? sortOrder.DESC : sortOrder.ASC;
        sortArrow = order === sortOrder.ASC ?
          ' table__header-text_sorted_asc' :
          ' table__header-text_sorted_desc';
      }

      className += sortArrow;
      onClick = () => {
        tableComponentSortChangeSignal({
          field: cell.sort.field,
          type: cell.sort.type,
          order,
        });
      };
    }

    const title = cell.name;
    const text = cell.name;

    return <span className={className} title={title} onClick={onClick}>{text}</span>;
  }

  render() {
    const { cells } = this.props;

    return (
      <div className="table__row table__row_header">
        {cells.map(cell => (
          <TableCell
            key={cell.id}
            className={classnames('table__cell', 'table__cell_header', cell.className)}
            value={this.getContent(cell)}
          />
        ))}
      </div>
    );
  }
}

export const TableHeader = connect(null, mapDispatchToProps)(TableHeaderInner);
