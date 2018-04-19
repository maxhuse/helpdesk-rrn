import React, { PureComponent } from 'react';

interface IProps {
  id: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}
export default class Radio extends PureComponent<IProps> {
  private inputRef: HTMLInputElement | null;

  get checked() {
    if (!this.inputRef) {
      return false;
    }

    return this.inputRef.checked;
  }

  set checked(value) {
    if (this.inputRef) {
      this.inputRef.checked = value;
    }
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
