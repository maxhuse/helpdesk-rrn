import React, { StatelessComponent } from 'react';

interface IProps {
  isDisabled?: boolean;
  okText: string;
  cancelText: string;
  onSubmit: () => void;
  closeAction: () => void;
}
const ModalButtons: StatelessComponent<IProps> = ({
  isDisabled = false,
  closeAction,
  onSubmit,
  okText,
  cancelText,
}) => (
  <div className="modal__footer">
    <button
      disabled={isDisabled}
      className="button button_flat button_flat_blue button_dialog"
      onClick={closeAction}
    >
      {cancelText}
    </button>
    <button
      disabled={isDisabled}
      className="button button_flat button_flat_blue button_dialog"
      onClick={onSubmit}
    >
      {okText}
    </button>
  </div>
);

export default ModalButtons;
