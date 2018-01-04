import React, { PureComponent } from 'react';

// id property is required
export default class Checkbox extends PureComponent {
  get checked() {
    return this.inputRef.checked;
  }

  set checked(value) {
    this.inputRef.checked = value;
  }

  render() {
    const { defaultChecked, disabled, id, onChange, checked } = this.props;

    return (
      <div className="checkbox">
        <input
          type="checkbox"
          className="checkbox_input"
          ref={(ref) => { this.inputRef = ref; }}
          id={id}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          checked={checked}
        />
        <label className="checkbox_label" htmlFor={id} />
      </div>
    );
  }
}
