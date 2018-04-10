import React, { PureComponent, ReactElement, MouseEvent } from 'react';
import { connect } from 'react-redux';
import Animate from 'rc-animate';
import { State, actions as toastsComponentActions } from 'ducks/components/toasts';
import ToastsItem from './toasts-item';

const mapDispatchToProps = Object.assign({}, {
  toastsComponentDeleteDelta: toastsComponentActions.toastsComponentDeleteDelta,
});

const mapStateToProps = state => ({
  toastsComponentIm: state.components.toastsComponentIm,
});

interface IToastsProps {
  toastsComponentIm: State;
  toastsComponentDeleteDelta: typeof toastsComponentActions.toastsComponentDeleteDelta;
}

class Toasts extends PureComponent<IToastsProps> {
  private onClick(event: MouseEvent<HTMLDivElement>): void {
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { toastsComponentIm, toastsComponentDeleteDelta } = this.props;
    const { items } = toastsComponentIm;
    let toastBlock: ReactElement<string> | null = null;

    const item = items.get(0);

    if (item !== undefined) {
      const { id } = item;

      toastBlock = (
        <ToastsItem
          key={id}
          type={item.type}
          clickAction={() => toastsComponentDeleteDelta(id)}
          initDeleteTimeout={() => window.setTimeout(() => toastsComponentDeleteDelta(id), 5000)}
        >
          {item.content}
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

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
