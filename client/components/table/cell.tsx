import React, { StatelessComponent, ReactElement } from 'react';

interface ITableCellProps {
  className: string;
  value: string | ReactElement<any>;
}
export const TableCell: StatelessComponent<ITableCellProps> = ({ className, value }) => (
  <div className={className} title={typeof value === 'string' ? value : undefined}>
    {value}
  </div>
);

interface IExpandedCellProps {
  children: ReactElement<any>;
  className: string;
  isExpanded: boolean;
  name: string;
  title: string;
}
export const ExpandableCell: StatelessComponent<IExpandedCellProps> =
({ className, isExpanded, name, title, children }) => (
  isExpanded ?
    <div className="table__row-parameter">
      <strong>{name}: </strong>
      {children}
    </div> :
    <div className={className} title={typeof title === 'string' ? title : undefined}>
      {children}
    </div>
);
