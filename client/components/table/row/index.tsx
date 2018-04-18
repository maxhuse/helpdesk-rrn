import React, { PureComponent, StatelessComponent, ComponentType, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { TCell, TCells, TItem, TRow, TRowButtons } from 'components/table/types';
import { TableCell } from 'components/table';
import { actions as tableActions } from 'ducks/components/table';
import RowButtons from './buttons';

// If value is undefined or empty string, put a dash
const getCellValue = value => (
  value === undefined || value === '' || value === null ?
    '\u2014' :
    value
);

const getLastCellComponent = (CellComponent: ComponentType<any>, iconButtons: TRowButtons) =>
  ({ className, componentProps, value, item }: {
  className: string,
  componentProps: { [key: string]: any },
  item: TItem,
  value: string | ReactElement<any>,
  }) => (
    <div className={className}>
      <CellComponent value={value} {...componentProps} />
      <div className="table__button-cell" onClick={event => event.stopPropagation()}>
        <RowButtons buttonType="icon" buttons={iconButtons} model={item} />
      </div>
    </div>
  );

interface ITableRowShrunkProps {
  item: TItem;
  shownCells: TCells;
  iconButtons: TRowButtons;
  disabled: boolean;
  getClassName: (item: TItem) => string;
  openRowAction: typeof tableActions.tableComponentOpenRowDelta;
  onRowClick: (id: string | number) => void;
}
const TableRowShrunk: StatelessComponent<ITableRowShrunkProps> = ({
  item,
  openRowAction,
  shownCells,
  disabled,
  getClassName,
  onRowClick,
  iconButtons,
}) => {
  const cellsLength = shownCells.length;
  const itemId = item.get('id');

  let className = classnames('table__row', { table__row_disabled: disabled });

  if (getClassName) {
    className += ` ${getClassName(item)}`;
  }

  // We can override default onClick action on the row
  const onRowClickAction = onRowClick ?
    () => onRowClick(itemId) :
    () => openRowAction(itemId);

  return (
    <div className={className} onClick={onRowClickAction}>
      {shownCells.map((cell, index) => {
        const CellComponent = cell.component || TableCell;
        const componentProps = cell.componentProps || {};
        const value = getCellValue(cell.getValue(item));

        if (index === cellsLength - 1 && iconButtons) {
          const LastCellComponent = getLastCellComponent(CellComponent, iconButtons);

          return (
            <LastCellComponent
              key={cell.id}
              className={classnames('table__cell', 'table__cell_buttons', cell.className)}
              value={value}
              componentProps={componentProps}
              item={item}
            />
          );
        }

        return (
          <CellComponent
            key={cell.name + cell.className}
            className={classnames('table__cell', cell.className)}
            value={value}
            isExpanded={false}
            {...componentProps}
          />
        );
      })}
    </div>
  );
};

interface ICellBlockProps {
  cell: TCell;
  item: TItem;
}
const CellBlock: StatelessComponent<ICellBlockProps> = ({ cell, item }) => (
  cell.component ?
    <cell.component name={cell.name} value={getCellValue(cell.getValue(item))} isExpanded /> :
    <div className="table__row-parameter">
      <strong>{cell.name}: </strong>
      <span>{getCellValue(cell.getValue(item))}</span>
    </div>
);

interface ITableRowExpandedProps {
  item: TItem;
  cells: TCells;
  row: TRow;
  shownCells: TCells;
  openedId: false | number;
  isRowsLocked: boolean;
  disabled: boolean;
  iconButtons: TRowButtons;
  textButtons: TRowButtons;
  getClassName: (item: TItem) => string;
  getHeaderClassName: (item: TItem) => string;
  openRowAction: typeof tableActions.tableComponentOpenRowDelta;
  closeRowAction: typeof tableActions.tableComponentCloseRowDelta;
}
class TableRowExpanded extends PureComponent<ITableRowExpandedProps> {
  private iconButtonsRef: RowButtons | null;
  private textButtonsRef: RowButtons | null;
  private headerContainerRef: HTMLDivElement | null;

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  private handleClick(event) {
    try {
      const { closeRowAction, isRowsLocked } = this.props;
      const { target } = event;
      const isClickedOutside = !findDOMNode(this).contains(target);
      const isHeaderClicked = this.headerContainerRef && this.headerContainerRef.contains(target);
      const isButtonClicked = this.isButtonClicked(target);

      if ((isClickedOutside || isHeaderClicked) && !isRowsLocked && !isButtonClicked) {
        closeRowAction();
      }
    } catch (error) {
      // do nothing, ie fix
    }
  }

  private isButtonClicked(target): boolean {
    if (
      (this.iconButtonsRef && this.iconButtonsRef.contains(target)) ||
      (this.textButtonsRef && this.textButtonsRef.contains(target))
    ) {
      return true;
    }

    return false;
  }

  render() {
    const {
      item,
      cells,
      iconButtons = [],
      textButtons = [],
      disabled,
      getClassName,
      getHeaderClassName,
    } = this.props;
    const visibleCells = cells.filter(cell => !cell.isHiddenOnOpened);

    // row class name
    let className = 'table__row table__row_opened';

    if (getClassName) {
      className += ` ${getClassName(item)}`;
    }

    // row-header class name
    let headerClassName = 'table__row-header';

    if (getHeaderClassName) {
      headerClassName += ` ${getHeaderClassName(item)}`;
    }

    return (
      <div className={classnames(className, { table__row_disabled: disabled })}>
        <div
          className="table__row-header-container"
          ref={(ref) => { this.headerContainerRef = ref; }}
        >
          <div className={headerClassName}>
            <RowButtons
              buttonType="text"
              buttons={textButtons}
              model={item}
              ref={(ref) => { this.textButtonsRef = ref; }}
            />
            <RowButtons
              buttonType="icon"
              buttons={iconButtons}
              model={item}
              ref={(ref) => { this.iconButtonsRef = ref; }}
            />
          </div>
        </div>
        <div className="table__row-parameters">
          {visibleCells.map(cell => <CellBlock key={cell.name} cell={cell} item={item} />)}
        </div>
      </div>
    );
  }
}

export const TableRow = (props) => {
  // Select component and filter cells
  if (props.item.get('id') === props.openedId) {
    return <TableRowExpanded {...props} />;
  }

  return <TableRowShrunk {...props} />;
};
