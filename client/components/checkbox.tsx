import React, { PureComponent } from 'react';

interface IProps {
  id: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
}
export default class Checkbox extends PureComponent<IProps> {
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
