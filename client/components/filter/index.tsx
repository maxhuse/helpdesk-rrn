import React, { MouseEvent, PureComponent, ReactElement, StatelessComponent } from 'react';
import i18next from 'i18next';
import { indexOf as _indexOf, isFunction as _isFunction } from 'lodash';
import { filterType } from 'client-constants';
import Switch from 'components/switch';
import Autocomplete from 'components/autocomplete';
import { TFilterFields } from 'components/table/types';
import { actions as tableActions, TFilters as TTableFilters } from 'ducks/components/table';
import DateInterval from './date-interval';

interface IFilterButtonsProps {
  onResetFilter: () => void;
  onChangeFilter: () => void;
}
const FilterButtons: StatelessComponent<IFilterButtonsProps> =
  ({ onResetFilter, onChangeFilter }) => (
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

interface IFilterProps {
  changeAction: typeof tableActions.tableComponentChangeFiltersDelta;
  resetAction: typeof tableActions.tableComponentResetFiltersDelta;
  filterFields: TFilterFields;
  filters: TTableFilters;
}
export default class Filter extends PureComponent<IFilterProps> {
  constructor(props) {
    super(props);

    this.onResetFilter = this.onResetFilter.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
  }

  private onChangeFilter(): void {
    const { changeAction, filterFields } = this.props;
    const filter = {};

    filterFields.forEach((field) => {
      const fieldKey = field.key;
      const refName = this.getRefName(field);
      const fieldRef = this[refName];
      let fieldValue;

      if (field.type === filterType.CHECKBOX) {
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

  private onResetFilter(): void {
    const { resetAction, filterFields } = this.props;

    filterFields.forEach((field) => {
      const refName = this.getRefName(field);
      const fieldRef = this[refName];

      switch (field.type) {
        case filterType.TEXT: {
          fieldRef.value = '';
          break;
        }

        case filterType.CHECKBOX: {
          fieldRef.checked = false;
          break;
        }

        case filterType.SELECT: {
          fieldRef.value = 'all';
          break;
        }

        case filterType.AUTOCOMPLETE: {
          fieldRef.reset();
          break;
        }

        case filterType.DATE_INTERVAL: {
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

  private getField(filterField, filterKey: number): ReactElement<any> {
    const { filters } = this.props;
    const currentValue: string | number | boolean | [number | undefined, number | undefined] =
      filters.get(filterField.key) || false;
    const refName = this.getRefName(filterField);
    let inputBlock;

    switch (filterField.type) {
      case filterType.TEXT: {
        inputBlock = (
          <input
            className="input input_filter"
            type="text"
            ref={(ref) => { this[refName] = ref; }}
            defaultValue={typeof currentValue === 'boolean' ? '' : currentValue.toString()}
          />
        );
        break;
      }

      case filterType.CHECKBOX: {
        inputBlock = (
          <Switch
            ref={(ref) => { this[refName] = ref; }}
            defaultChecked={typeof currentValue === 'boolean' ? currentValue : false}
          />
        );

        break;
      }

      case filterType.SELECT: {
        inputBlock = (
          <select
            className="select"
            ref={(ref) => { this[refName] = ref; }}
            defaultValue={currentValue.toString()}
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

      case filterType.DATE_INTERVAL: {
        inputBlock = (
          <DateInterval
            ref={(ref) => { this[refName] = ref; }}
            defaultValue={typeof currentValue === 'object' ? currentValue : undefined}
          />
        );
        break;
      }

      case filterType.AUTOCOMPLETE: {
        const filterFieldItems = _isFunction(filterField.items) ?
          filterField.items() :
          filterField.items;

        inputBlock = (
          <Autocomplete
            defaultValue={currentValue}
            ref={(ref) => { this[refName] = ref; }}
            getValue={filterField.getValue}
            getText={filterField.getText}
            getFilteredString={filterField.getFilteredString}
            placeholder={filterField.placeholder}
            items={filterFieldItems}
            emptyValue={0}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              // prevent bubbling when autocomplete item clicked
              if (_indexOf(event.currentTarget.classList, 'js-autocomplete-item') !== -1) {
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

  private getRefName(filterField): string {
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
