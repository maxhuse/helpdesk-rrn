import React, { StatelessComponent } from 'react';
import classnames from 'classnames';

interface IProps {
  title?: string;
  icon: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}
const IconButton: StatelessComponent<IProps> = ({
  title,
  icon,
  onClick,
  className,
  disabled = false
}) => (
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
