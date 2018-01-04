import React from 'react';
import classnames from 'classnames';

const IconButton = ({ title, icon, onClick, className, disabled = false }) => (
  <button
    className={classnames('button', 'button_flat', 'button_icon', className)}
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    <i className="material-icons">{icon}</i>
  </button>
);

export default IconButton;
