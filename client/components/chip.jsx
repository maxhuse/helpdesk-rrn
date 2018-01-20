import React from 'react';

const Chip = ({ color, text }) => (
  <span className={`chip chip_${color}`}>{text}</span>
);

export default Chip;
