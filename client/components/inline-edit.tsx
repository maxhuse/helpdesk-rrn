import React, { PureComponent, StatelessComponent } from 'react';
import { findDOMNode } from 'react-dom';
import Input from 'components/input';
import IconButton from 'components/icon-button';

interface IEditClosedProps {
  defaultValue?: string;
  label?: string;
  isBlocked?: boolean;
  onClickEdit: () => any;
}

const InlineEditClosed: StatelessComponent<IEditClosedProps> =
  ({ label, defaultValue, isBlocked, onClickEdit }) => (
    <div className="inline-edit">
      <span className="inline-edit__cell inline-edit__cell_label">
        {label}:
      </span>
      <span className="inline-edit__cell inline-edit__cell_value">
        {defaultValue || 'ー'}
      </span>
      <IconButton
        onClick={() => {
          if (!isBlocked) {
            onClickEdit();
          }
        }}
        icon="edit"
        disabled={isBlocked}
      />
    </div>
  );

interface IEditOpenedProps {
  name: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  isBlocked?: boolean;
  closeEditingAction: () => any;
  validate: (value: string) => string | false;
  onSubmit: (options: { name: string, value: string }) => void;
}
class InlineEditOpened extends PureComponent<IEditOpenedProps> {
  private inputRef: Input | null;

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  private onClickDone(): void {
    const {
      validate,
      onSubmit,
      name,
    } = this.props;
    const value = this.inputRef ? this.inputRef.value : '';
    const validationError = validate(value);

    if (validationError) {
      if (this.inputRef) {
        this.inputRef.error = validationError;
      }
    } else {
      onSubmit({ name, value });
    }
  }

  public get value() {
    if (!this.inputRef) {
      return '';
    }

    return this.inputRef.value;
  }

  public set error(value) {
    if (this.inputRef) {
      this.inputRef.error = value;
    }
  }

  private handleClick(event): void {
    const {
      isBlocked,
      closeEditingAction,
    } = this.props;

    try {
      if (!isBlocked && !findDOMNode(this).contains(event.target)) {
        closeEditingAction();
      }
    } catch (error) {
      // do nothing, ie fix
    }
  }

  render() {
    const {
      defaultValue,
      label,
      placeholder,
      name,
      isBlocked,
    } = this.props;

    return (
      <div className="inline-edit">
        <label
          htmlFor={`inline_edit_${name}`}
          className="inline-edit__cell inline-edit__cell_label"
        >
          {label}:
        </label>
        <div className="inline-edit__cell inline-edit__cell_value">
          <Input
            disabled={isBlocked}
            id={`inline_edit_${name}`}
            ref={(ref) => { this.inputRef = ref; }}
            defaultValue={defaultValue}
            placeholder={placeholder}
          />
        </div>
        <IconButton
          icon="done"
          disabled={isBlocked}
          onClick={this.onClickDone}
          className="button_flat_green"
        />
      </div>
    );
  }
}

interface IInlineEditProps {
  name: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  isBlocked?: boolean;
  isEditing: boolean;
  closeEditingAction: () => any;
  validate: (value: string) => string | false;
  onSubmit: (options: { name: string, value: string }) => void;
  onClickEdit: () => any;
}
const InlineEdit: StatelessComponent<IInlineEditProps> = ({
  defaultValue,
  label,
  placeholder,
  name,
  isBlocked,
  isEditing,
  onClickEdit,
  closeEditingAction,
  validate,
  onSubmit,
}) => {
  if (isEditing) {
    return (
      <InlineEditOpened
        label={label}
        defaultValue={defaultValue}
        isBlocked={isBlocked}
        placeholder={placeholder}
        name={name}
        onSubmit={onSubmit}
        validate={validate}
        closeEditingAction={closeEditingAction}
      />
    );
  }

  return (
    <InlineEditClosed
      label={label}
      defaultValue={defaultValue}
      isBlocked={isBlocked}
      onClickEdit={onClickEdit}
    />
  );
};

export default InlineEdit;
