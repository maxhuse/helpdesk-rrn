import React, { PureComponent } from 'react';
import { TableCell } from './cell';

export class TableHeader extends PureComponent {
  getContent(cell) {
    const { sortChangeAction, currentSort } = this.props;

    let className = 'table__header-text';
    let onClick = false;

    if (cell.sort) {
      const currentOrder = currentSort.get('order');
      let order = 'asc';
      let sortArrow = '';

      if (currentSort.get('field') === cell.sort.field) {
        order = currentOrder === 'asc' ? 'desc' : 'asc';
        sortArrow = order === 'asc' ?
          ' table__header-text_sorted_asc' :
          ' table__header-text_sorted_desc';
      }

      className += sortArrow;
      onClick = () => {
        sortChangeAction({
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
        {cells.map((cell) => {
          const className = cell.className ? cell.className : '';

          return (
            <TableCell
              key={cell.id}
              className={`table__cell table__cell_header ${className}`}
              value={this.getContent(cell)}
            />
          );
        })}
      </div>
    );
  }
}
