import React, { PureComponent } from 'react';
import classnames from 'classnames';

export default class Input extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { error: false };
  }

  get error() {
    return this.state.error;
  }

  get value() {
    return this.inputRef.value;
  }

  set error(newValue) {
    this.setState({
      error: newValue,
    });
  }

  set value(newValue) {
    this.inputRef.value = newValue;
  }

  clearError() {
    this.setState({
      error: false,
    });
  }

  render() {
    const {
      value,
      defaultValue,
      className,
      id,
      name,
      placeholder,
      onChange,
      onBlur,
      onFocus,
      type = 'text',
      autoComplete = undefined,
      disabled = false,
      autoFocus = false,
    } = this.props;

    const childProps = {
      id,
      name,
      value,
      defaultValue,
      type,
      placeholder,
      onChange,
      onBlur,
      disabled,
      autoComplete,
      autoFocus,
      className: classnames(
        'input-component__field',
        { 'input-component__field_error': this.state.error },
        className
      ),
    };

    const errorClassName = classnames('input-component__error', this.props.errorClassName);

    return (
      <div className="input-component">
        <input
          {...childProps}
          onFocus={(event) => {
            this.clearError();

            if (onFocus) {
              onFocus(event);
            }
          }}
          ref={(ref) => { this.inputRef = ref; }}
        />
        <span className={errorClassName}>{this.state.error || ''}</span>
      </div>
    );
  }
}
