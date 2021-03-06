import React, { PureComponent, StatelessComponent, MouseEvent } from 'react';
import { findDOMNode } from 'react-dom';
import { List } from 'immutable';
import Input from 'components/input';
import {
  indexOf as _indexOf,
  isObject as _isObject,
  isEqual as _isEqual,
} from 'lodash';
import classnames from 'classnames';
import { TItem, TItems } from 'components/table/types';

interface IAutocompleteListProps {
  getText: (item: any) => string;
  onSelect: (item: any) => void;
  items: TItems;
}
const AutocompleteList: StatelessComponent<IAutocompleteListProps> =
  ({ items, getText, onSelect }) => (
    <div
      className={
        classnames('autocomplete__list', {
          autocomplete__list_hidden: items.size === 0,
        })
      }
    >
      {items.map(item => (
        <div
          key={item.get('id')}
          className="autocomplete__item js-autocomplete-item"
          onClick={() => {
            onSelect(item);
          }}
        >
          {getText(item)}
        </div>
      ))}
    </div>
  );

interface IAutocompleteProps {
  id: string;
  name?: string;
  items: TItems;
  defaultValue: number | string | boolean;
  getText: (item: any) => string;
  getValue: (item: any) => any;
  getFilteredString: (item: any) => string;
  placeholder: string;
  emptyValue: number;
  errorClassName?: string;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
}
interface IAutocompleteState {
  inputText: string;
  isOnFocus: boolean;
  selectedItem: TItem | false;
}
export default class Autocomplete extends PureComponent<IAutocompleteProps, IAutocompleteState> {
  private inputRef: Input | null;

  constructor(props) {
    super(props);

    this.resetState(props);

    // listen click event to handle click outside
    this.handleClick = this.handleClick.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onFocusInput = this.onFocusInput.bind(this);

    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  private onChangeInput(event): void {
    this.setState({ inputText: event.target.value });
  }

  private onClickOutside(): void {
    const { inputText, selectedItem } = this.state;
    const { getText } = this.props;

    // No text in input ( clear all )
    if (inputText.trim().length === 0) {
      this.setState({
        selectedItem: false,
        isOnFocus: false,
        inputText: '',
      });
      return;
    }

    // No item selected
    if (selectedItem === false) {
      // Try to find item by input text
      const searchedItem = this.findItemByText(inputText);

      // Nothing founded (clear all)
      if (!searchedItem) {
        this.setState({
          selectedItem: false,
          isOnFocus: false,
          inputText: '',
        });
        return;
      }

      // Select founded item
      this.setState({
        inputText: getText(searchedItem),
        selectedItem: searchedItem,
        isOnFocus: false,
      });
      return;
    }

    // There is selected item
    const selectedItemText = getText(selectedItem);

    // The entered text matches the text of the selected item.
    // Just remove focus.
    if (inputText === selectedItemText) {
      this.setState({
        isOnFocus: false,
      });
      return;
    }

    // Try to find item by input text
    const searchedItem = this.findItemByText(inputText);

    // Select founded item
    if (searchedItem !== false) {
      this.setState({
        inputText: getText(searchedItem),
        selectedItem: searchedItem,
        isOnFocus: false,
      });
      return;
    }

    // Nothing founded
    // Use text of selected item
    this.setState({
      inputText: selectedItemText,
      isOnFocus: false,
    });
  }

  private onFocusInput(): void {
    this.setState({ isOnFocus: true });
  }

  get value() {
    const { getValue, emptyValue } = this.props;
    const { selectedItem } = this.state;

    if (selectedItem === false) {
      return emptyValue;
    }

    return getValue(selectedItem);
  }

  set error(errorText) {
    if (this.inputRef) {
      this.inputRef.error = errorText;
    }
  }

  private getItemByValue(selectedValue, items, getValue): TItem | false {
    // It used inside constructor...
    // Because of that we not use this.props here (IE fix)
    const searchedItem = items.find((item) => {
      if (_isObject(selectedValue)) {
        return _isEqual(getValue(item), selectedValue);
      }

      return getValue(item) === selectedValue;
    });

    return searchedItem || false;
  }

  private getVisibleItems(items: TItems, inputText: string): TItems {
    const { getFilteredString } = this.props;

    // Show no items if input not in focus
    if (!this.state.isOnFocus) {
      return List();
    }

    // Show all items when nothing entered
    if (inputText.length === 0) {
      return items;
    }

    // Filter items by input text
    const normalizedInputText = inputText.toLowerCase().trim();

    return items.filter((item) => {
      const filteredString = getFilteredString(item).toLowerCase().trim();

      return filteredString.search(normalizedInputText) !== -1;
    });
  }

  public reset(): void {
    this.setState({
      selectedItem: false,
      inputText: '',
      isOnFocus: false,
    });
  }

  private resetState(
    { getText, defaultValue, items, getValue }: {
    getText: (item: any) => string,
    defaultValue: number | string | boolean,
    items: TItems,
    getValue: (item: any) => any,
    }
  ): void {
    // Not use this.props here, because it used in constructor ( IE fix )

    // Choose default item by default value
    if (defaultValue !== false && defaultValue !== undefined) {
      const selectedItem = this.getItemByValue(defaultValue, items, getValue);

      this.state = {
        selectedItem,
        inputText: selectedItem ? getText(selectedItem) : '',
        isOnFocus: false,
      };
    } else {
      // No default value selected
      this.state = {
        selectedItem: false,
        inputText: '',
        isOnFocus: false,
      };
    }
  }

  private handleClick(event): void {
    try {
      // Clicked not an input
      if (!findDOMNode(this).contains(event.target)) {
        // Clicked not an autocomplete item
        if (_indexOf(event.target.classList, 'js-autocomplete-item') === -1) {
          this.onClickOutside();
        }
      }
    } catch (error) {
      // Do nothing, ie fix
    }
  }

  private findItemByText(inputText: string): TItem | false {
    const { items, getText } = this.props;
    const inputTextNormalized = inputText.toLowerCase().trim();

    const searchedItem = items.find(
      item => getText(item).toLowerCase().trim() === inputTextNormalized
    );

    return searchedItem || false;
  }

  private selectItem(item: TItem): void {
    const { getText } = this.props;

    this.setState({
      selectedItem: item,
      inputText: getText(item),
      isOnFocus: false,
    });
  }

  private sortItems(items: TItems) {
    const { getText } = this.props;

    return items.sort((valueA, valueB) => {
      const textA = getText(valueA);
      const textB = getText(valueB);

      if (textA === '' && textB !== '') return 1;
      if (textB === '' && textA !== '') return -1;

      const firstA = textA[0].toLowerCase();
      const firstB = textB[0].toLowerCase();

      if (firstA > firstB) return 1;
      if (firstA < firstB) return -1;

      return 0;
    });
  }

  render() {
    const { getText, items, onClick, id, placeholder, name } = this.props;
    const visibleItems = this.getVisibleItems(items, this.state.inputText);
    const sortedVisibleItems = this.sortItems(visibleItems);

    return (
      <div className="autocomplete" onClick={onClick}>
        <Input
          id={id}
          name={name}
          ref={(ref) => { this.inputRef = ref; }}
          value={this.state.inputText}
          placeholder={placeholder}
          onChange={this.onChangeInput}
          onFocus={this.onFocusInput}
          errorClassName={this.props.errorClassName}
        />

        <AutocompleteList
          items={sortedVisibleItems}
          getText={getText}
          onSelect={(item) => {
            this.selectItem(item);
          }}
        />
      </div>
    );
  }
}
