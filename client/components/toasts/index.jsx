import React, { PureComponent } from 'react';
import Animate from 'rc-animate';
import ToastsItem from './toasts-item';

export default class Toasts extends PureComponent {
  onClick(event) {
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { toastsComponentIm, toastsComponentDeleteDelta } = this.props;
    const items = toastsComponentIm.get('items');
    let toastBlock = null;

    if (items.size > 0) {
      const item = items.get(0);
      const id = item.get('id');

      toastBlock = (
        <ToastsItem
          key={id}
          itemKey={id}
          type={item.get('type')}
          clickAction={() => toastsComponentDeleteDelta(id)}
          initDeleteTimeout={() => setTimeout(() => toastsComponentDeleteDelta(id), 5000)}
        >
          {item.get('content')}
        </ToastsItem>
      );
    }

    return (
      <div className="toasts" onClick={this.onClick}>
        <Animate transitionAppear transitionName="toast">
          {toastBlock}
        </Animate>
      </div>
    );
  }
}
