import React, { PureComponent } from 'react';

const getButtonByType = buttonType => class Buttons extends PureComponent {
  contains(target) {
    return this.wrapperRef.contains(target);
  }

  render() {
    const { buttons, model } = this.props;

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

            const key = buttonType === 'text' ?
              button.getText(model) :
              button.getIcon(model);

            return (
              <button
                className={className}
                onClick={() => button.onClick(model)}
                key={key}
                title={button.getTitle(model)}
              >
                {buttonType === 'text' ?
                  button.getText(model) :
                  <i className="material-icons">{button.getIcon(model)}</i>
                }
              </button>
            );
          })
        }
      </div>
    );
  }
};

export const TextButtons = getButtonByType('text');
export const IconButtons = getButtonByType('icon');
