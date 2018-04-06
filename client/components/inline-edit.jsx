import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import Input from 'components/input';
import IconButton from 'components/icon-button';

const InlineEditClosed = ({ label, defaultValue, isBlocked, onClickEdit }) => (
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

class InlineEditOpened extends PureComponent {
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

  onClickDone() {
    const {
      validate,
      onSubmit,
      name,
    } = this.props;
    const { value } = this.inputRef;
    const validationError = validate(value);

    if (validationError) {
      this.inputRef.error = validationError;
    } else {
      onSubmit({ name, value });
    }
  }

  get value() {
    return this.inputRef.value;
  }

  set error(value) {
    this.inputRef.error = value;
  }

  handleClick(event) {
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

const InlineEdit = ({
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
