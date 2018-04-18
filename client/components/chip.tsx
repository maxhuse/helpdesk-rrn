import React, { StatelessComponent } from 'react';

interface IProps {
  color: string;
  text: string;
}
const Chip: StatelessComponent<IProps> = ({ color, text }) => (
  <span className={`chip chip_${color}`}>{text}</span>
);

export default Chip;
