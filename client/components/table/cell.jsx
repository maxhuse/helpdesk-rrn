import React from 'react';

export const TableCell = ({ className, value }) => (
  <div className={className} title={typeof value === 'string' ? value : null}>
    {value}
  </div>
);

export const ExpandableCell = ({ className, isExpanded, name, title, children }) => (
  isExpanded ?
    <div className="table__row-parameter">
      <strong>{name}: </strong>
      {children}
    </div> :
    <div className={className} title={typeof title === 'string' ? title : null}>
      {children}
    </div>
);
