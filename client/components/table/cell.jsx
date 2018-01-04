import React from 'react';

export const TableCell = ({ className, value }) => (
  <div className={className} title={typeof value === 'string' ? value : null}>
    {value}
  </div>
);
