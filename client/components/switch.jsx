import React, { PureComponent } from 'react';

export default class Switch extends PureComponent {
  get checked() {
    return this.inputRef.checked;
  }

  set checked(value) {
    this.inputRef.checked = value;
  }

  render() {
    const { defaultChecked, disabled, id, checked, onChange } = this.props;

    return (
      <div className="switch">
        <label htmlFor={id} className="switch__label">
          <input
            id={id}
            className="switch__input"
            type="checkbox"
            ref={(ref) => { this.inputRef = ref; }}
            defaultChecked={defaultChecked}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
          />
          <span className="switch__lever" />
        </label>
      </div>
    );
  }
}
