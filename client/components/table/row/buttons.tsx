import React, { PureComponent } from 'react';
import { TRowButtons, TItem } from 'components/table/types';

interface IProps {
  buttons: TRowButtons;
  model: TItem;
  buttonType: 'text' | 'icon';
}
export default class RowButtons extends PureComponent<IProps> {
  private wrapperRef: HTMLDivElement | null;

  public contains(target): boolean {
    if (!this.wrapperRef) {
      return false;
    }

    return this.wrapperRef.contains(target);
  }

  render() {
    const { buttons, model, buttonType } = this.props;

    return (
      <div
        className="table__row-buttons"
        ref={(ref) => { this.wrapperRef = ref; }}
      >
        {
          buttons.map((button) => {
            if (button.isShown && !button.isShown(model)) {
              return null;
            }

            let className = 'button button_table-header';

            if (button.getClassName) {
              className += ` ${button.getClassName(model)}`;
            }

            if (!button.getText && !button.getIcon) {
              throw new Error('button.getText or button.getIcon must specified');
            }

            const key = buttonType === 'text' ?
              button.getText && button.getText(model) :
              button.getIcon && button.getIcon(model);

            return (
              <button
                className={className}
                onClick={() => button.onClick(model)}
                key={key}
                title={button.getTitle(model)}
              >
                {buttonType === 'text' ?
                  button.getText && button.getText(model) :
                  button.getIcon && (<i className="material-icons">{button.getIcon(model)}</i>)
                }
              </button>
            );
          })
        }
      </div>
    );
  }
}
