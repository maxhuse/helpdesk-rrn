/* global document */
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { TableCell } from '../cell';
import { TextButtons, IconButtons } from './buttons';

export const TableRow = (props) => {
  // select component and filter cells
  if (props.item.get('id') === props.openedId) {
    return <TableRowExpanded {...props} />;
  }

  return <TableRowShrunk {...props} />;
};

const getLastCellComponent = (CellComponent, iconButtons) =>
  ({ className, componentProps, value, item }) => (
    <div className={className}>
      <CellComponent value={value} {...componentProps} />
      <div className="table__button-cell" onClick={event => event.stopPropagation()}>
        <IconButtons buttons={iconButtons} model={item} />
      </div>
    </div>
  );

const TableRowShrunk = ({
  item,
  openRowAction,
  shownCells,
  disabled,
  getClassName,
  iconButtons,
}) => {
  const cellsLength = shownCells.length;

  let className = disabled ? 'table__row table__row_disabled' : 'table__row';

  if (getClassName) {
    className += ` ${getClassName(item)}`;
  }

  return (
    <div className={className} onClick={() => openRowAction(item.get('id'))}>
      {shownCells.map((cell, index) => {
        const CellComponent = cell.component || TableCell;
        const componentProps = cell.componentProps || {};
        const cellClassName = cell.className ? cell.className : '';

        if (index === cellsLength - 1 && iconButtons) {
          const LastCellComponent = getLastCellComponent(CellComponent, iconButtons);

          return (
            <LastCellComponent
              key={cell.id}
              className={`table__cell table__cell_buttons ${cellClassName}`}
              value={cell.getValue(item)}
              componentProps={componentProps}
              item={item}
            />
          );
        }

        return (
          <CellComponent
            key={cell.name + cell.className}
            className={`table__cell ${cellClassName}`}
            value={cell.getValue(item)}
            isExpanded={false}
            {...componentProps}
          />
        );
      })}
    </div>
  );
};

const CellBlock = ({ cell, item }) => (
  cell.component ?
    <cell.component name={cell.name} value={cell.getValue(item)} isExpanded /> :
    <div className="table__row-parameter">
      <strong>{cell.name}: </strong>
      <span>{cell.getValue(item)}</span>
    </div>
);

class TableRowExpanded extends PureComponent {
  constructor(props) {
    super(props);

    this.handleClickBinded = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickBinded, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickBinded, false);
  }

  handleClick(event) {
    try {
      const { closeRowAction, isRowsLocked } = this.props;
      const { target } = event;
      const isClickedOutside = !findDOMNode(this).contains(target);
      const isHeaderClicked = this.headerContainerRef.contains(target);
      const isButtonClicked = this.isButtonClicked(target);

      if ((isClickedOutside || isHeaderClicked) && !isRowsLocked && !isButtonClicked) {
        closeRowAction();
      }
    } catch (error) {
      // do nothing, ie fix
    }
  }

  isButtonClicked(target) {
    return this.iconButtonsRef.contains(target) || this.textButtonsRef.contains(target);
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
            <TextButtons
              buttons={textButtons}
              model={item}
              ref={(ref) => { this.textButtonsRef = ref; }}
            />
            <IconButtons
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
