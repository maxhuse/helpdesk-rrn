import React, { StatelessComponent } from 'react';

interface IProps {
  readonly text: string;
}
const ModalHeader: StatelessComponent<IProps> = ({ text }) => (
  <div className="modal__header">
    <span className="modal__title">{text}</span>
  </div>
);

export default ModalHeader;
