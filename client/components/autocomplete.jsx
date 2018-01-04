/* global document */
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { List } from 'immutable';
import Input from 'components/input';
import {
  indexOf as _indexOf,
  isObject as _isObject,
  isEqual as _isEqual,
} from 'lodash';
import classnames from 'classnames';

const AutocompleteList = ({ items, getText, onSelect }) => (
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

export default class Autocomplete extends PureComponent {
  constructor(props) {
    super(props);

    this.resetState(props);

    // listen click event to handle click outside
    this.handleClickBinded = this.handleClick.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onFocusInput = this.onFocusInput.bind(this);

    document.addEventListener('click', this.handleClickBinded, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickBinded, false);
  }

  onChangeInput(event) {
    this.setState({ inputText: event.target.value });
  }

  onClickOutside() {
    const { inputText, selectedItem } = this.state;
    const { getText } = this.props;

    // no text in input ( clear all )
    if (inputText.trim().length === 0) {
      this.setState({
        selectedItem: false,
        isOnFocus: false,
        inputText: '',
      });
      return;
    }

    // no item selected
    if (selectedItem === false) {
      // try to find item by input text
      const searchedItem = this.findItemByText(inputText);

      // nothing founded (clear all)
      if (searchedItem === false) {
        this.setState({
          selectedItem: false,
          isOnFocus: false,
          inputText: '',
        });
        return;
      }

      // select founded item
      this.setState({
        inputText: getText(searchedItem),
        selectedItem: searchedItem,
        isOnFocus: false,
      });
      return;
    }

    // there is selected item
    const selectedItemText = getText(selectedItem);

    // введенный текст совпадает с текстом выбранного item
    // просто снимем фокус
    if (inputText === selectedItemText) {
      this.setState({
        isOnFocus: false,
      });
      return;
    }

    // try to find item by input text
    const searchedItem = this.findItemByText(inputText);

    // select founded item
    if (searchedItem !== false) {
      this.setState({
        inputText: getText(searchedItem),
        selectedItem: searchedItem,
        isOnFocus: false,
      });
      return;
    }

    // nothing founded
    // use text of selected item
    this.setState({
      inputText: selectedItemText,
      isOnFocus: false,
    });
  }

  onFocusInput() {
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
    this.inputRef.error = errorText;
  }

  getItemByValue(selectedValue, items, getValue) {
    // it used inside constructor...
    // Because of that we not use this.props here (IE fix)
    const searchedItem = items.find((item) => {
      if (_isObject(selectedValue)) {
        return _isEqual(getValue(item), selectedValue);
      }

      return getValue(item) === selectedValue;
    });

    return searchedItem || false;
  }

  getVisibleItems(items, inputText) {
    const { getFilteredString } = this.props;

    // show no items if input not in focus
    if (!this.state.isOnFocus) {
      return List();
    }

    // show all items when nothing entered
    if (inputText.length === 0) {
      return items;
    }

    // filter items by input text
    const normalizedInputText = inputText.toLowerCase().trim();
    const filteredItems = items.filter((item) => {
      const filteredString = getFilteredString(item).toLowerCase().trim();

      return filteredString.search(normalizedInputText) !== -1;
    });

    return filteredItems;
  }

  reset(options = {}) {
    this.resetState(this.props, options);
  }

  resetState({ getText, defaultValue, items, getValue }, options = {}) {
    // no use this.props here, because it used in constructor ( IE fix )

    // choose default item by default value
    if (
      // hard reset (prevent default value)
      !options.isHard &&
      (defaultValue !== false) &&
      (defaultValue !== undefined)
    ) {
      const selectedItem = this.getItemByValue(defaultValue, items, getValue);

      this.state = {
        selectedItem,
        inputText: selectedItem ? getText(selectedItem) : '',
        isOnFocus: false,
      };
    } else {
      // no default value selected
      this.state = {
        selectedItem: false,
        inputText: '',
        isOnFocus: false,
      };
    }
  }

  handleClick(event) {
    try {
      // clicked not an input
      if (!findDOMNode(this).contains(event.target)) {
        // clicked not an autocomplete item
        if (_indexOf(event.target.classList, 'js-autocomplete-item') === -1) {
          this.onClickOutside();
        }
      }
    } catch (error) {
      // do nothing, ie fix
    }
  }

  findItemByText(inputText) {
    const { items, getText } = this.props;
    const inputTextNormalized = inputText.toLowerCase().trim();

    const searchedItem = items.find(
      item => getText(item).toLowerCase().trim() === inputTextNormalized
    );

    return searchedItem || false;
  }

  selectItem(item) {
    const { getText } = this.props;

    this.setState({
      selectedItem: item,
      inputText: getText(item),
      isOnFocus: false,
    });
  }

  sortItems(items) {
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
