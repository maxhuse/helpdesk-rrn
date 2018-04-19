import React, { PureComponent, MouseEvent, ChangeEvent } from 'react';
import classnames from 'classnames';

interface IProps {
  id: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  tagName?: 'input' | 'textarea';
  name?: string;
  type?: string;
  className?: string;
  errorClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onFocus?: (e: MouseEvent<HTMLInputElement| HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
}
interface IState {
  error: string | boolean;
}
export default class Input extends PureComponent<IProps, IState> {
  private inputRef: HTMLInputElement | HTMLTextAreaElement | null;

  constructor(props) {
    super(props);

    this.state = { error: false };
  }

  public get error() {
    return this.state.error;
  }

  public get value() {
    if (!this.inputRef) {
      return '';
    }

    return this.inputRef.value;
  }

  public set error(newValue) {
    this.setState({
      error: newValue,
    });
  }

  public set value(newValue) {
    if (this.inputRef) {
      this.inputRef.value = newValue;
    }
  }

  private clearError(): void {
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
      tagName = 'input',
      autoComplete = undefined,
      disabled = false,
      autoFocus = false,
    } = this.props;

    const isTextArea = tagName === 'textarea';

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
        {
          'input-component__field_textarea': isTextArea,
          'input-component__field_error': this.state.error
        },
        className
      ),
    };

    const errorClassName = classnames('input-component__error', this.props.errorClassName);
    const TagName = isTextArea ? 'textarea' : 'input';

    return (
      <div className="input-component">
        <TagName
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
