import React, { PureComponent } from 'react';
import i18next from 'i18next';
import { indexOf as _indexOf } from 'lodash';
import Switch from 'components/switch';
import Autocomplete from 'components/autocomplete';
import DateInterval from './date-interval';

const FilterButtons = ({ onResetFilter, onChangeFilter }) => (
  <div className="filter__buttons">
    <button
      className="button button_flat button_flat_blue"
      onClick={onResetFilter}
    >
      {i18next.t('reset')}
    </button>

    <button
      className="button button_flat button_flat_blue"
      onClick={onChangeFilter}
    >
      {i18next.t('filter')}
    </button>
  </div>
);

export default class Filter extends PureComponent {
  constructor(props) {
    super(props);

    this.onResetFilter = this.onResetFilter.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
  }

  onChangeFilter() {
    const { changeAction, filterFields } = this.props;
    const filter = {};

    filterFields.forEach((field) => {
      const fieldKey = field.key;
      const refName = this.getRefName(field);
      const fieldRef = this[refName];
      let fieldValue;

      if (field.type === 'checkbox') {
        fieldValue = fieldRef.checked;
      } else {
        fieldValue = fieldRef.value;
      }

      if (fieldValue && fieldValue !== 'all') {
        filter[fieldKey] = fieldValue;
      }
    });

    changeAction(filter);
  }

  onResetFilter() {
    const { resetAction, filterFields } = this.props;

    filterFields.forEach((field) => {
      const refName = this.getRefName(field);
      const fieldRef = this[refName];

      switch (field.type) {
        case 'text': {
          fieldRef.value = '';
          break;
        }

        case 'checkbox': {
          fieldRef.checked = false;
          break;
        }

        case 'select': {
          fieldRef.value = 'all';
          break;
        }

        case 'autocomplete': {
          fieldRef.reset({ isHard: true });
          break;
        }

        case 'dateInterval': {
          fieldRef.value = [undefined, undefined];
          break;
        }

        default: {
          break;
        }
      }
    });

    resetAction();
  }

  getField(filterField, filterKey) {
    const { filters } = this.props;
    const currentValue = filters.get(filterField.key) || false;
    const refName = this.getRefName(filterField);
    let inputBlock;

    switch (filterField.type) {
      case 'text': {
        inputBlock = (
          <input
            className="input input_filter"
            type="text"
            ref={(ref) => { this[refName] = ref; }}
            defaultValue={currentValue || ''}
          />
        );
        break;
      }

      case 'checkbox': {
        inputBlock = (
          <Switch
            ref={(ref) => { this[refName] = ref; }}
            defaultChecked={currentValue}
          />
        );

        break;
      }

      case 'select': {
        inputBlock = (
          <select
            className="select"
            ref={(ref) => { this[refName] = ref; }}
            defaultValue={currentValue}
          >
            <option key={-1} value="all">{i18next.t('all')}</option>
            {filterField.options.map(elem => (
              <option key={elem.value} value={elem.value}>
                {elem.name}
              </option>
            ))}
          </select>
        );
        break;
      }

      case 'dateInterval': {
        inputBlock = (
          <DateInterval
            ref={(ref) => { this[refName] = ref; }}
            defaultValue={currentValue || undefined}
          />
        );
        break;
      }

      case 'autocomplete': {
        inputBlock = (
          <Autocomplete
            defaultValue={currentValue}
            ref={(ref) => { this[refName] = ref; }}
            getValue={filterField.getValue}
            getText={filterField.getText}
            getFilteredString={filterField.getFilteredString}
            placeholder={filterField.placeholder}
            items={filterField.items}
            emptyValue={0}
            onClick={(event) => {
              // prevent bubbling when autocomplete item clicked
              if (_indexOf(event.target.classList, 'js-autocomplete-item') !== -1) {
                event.nativeEvent.stopImmediatePropagation();
              }
            }}
          />
        );
        break;
      }

      default: {
        inputBlock = null;
      }
    }

    return (
      <div className="filter__item" key={filterKey}>
        <div className="filter__field-name">
          {filterField.name}
        </div>

        <div className="filter__field-input">
          {inputBlock}
        </div>
      </div>
    );
  }

  getRefName(filterField) {
    return `${filterField.key}Ref`;
  }

  render() {
    const { filterFields } = this.props;

    return (
      <div className="filter">

        <div className="filter__items">
          {filterFields.map((field, key) => this.getField(field, key))}
        </div>

        <FilterButtons
          onResetFilter={this.onResetFilter}
          onChangeFilter={this.onChangeFilter}
        />
      </div>
    );
  }
}
