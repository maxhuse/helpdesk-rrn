import React, { PureComponent } from 'react';

// id property is required
export default class Radio extends PureComponent {
  get checked() {
    return this.inputRef.checked;
  }

  set checked(value) {
    this.inputRef.checked = value;
  }

  render() {
    const { defaultChecked, disabled, id, onChange, name, checked, readOnly } = this.props;

    return (
      <div className="radio">
        <input
          type="radio"
          className="radio_input"
          ref={(ref) => { this.inputRef = ref; }}
          id={id}
          name={name}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          checked={checked}
          readOnly={readOnly}
        />
        <label className="radio_label" htmlFor={id} />
      </div>
    );
  }
}
