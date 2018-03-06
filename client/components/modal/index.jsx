/* global document */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group';

const modalRoot = document.getElementById('modal-root');

export default class Modal extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.modalClose = this.modalClose.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyup, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyup, false);
  }

  onKeyup(event) {
    // Close all windows when pressing Esc.
    // Only the active window listens events to avoid unnecessary computations.
    if (event.keyCode === 27 &&
      this.props.modalComponentIm.get('activeId') === this.props.modalId
    ) {
      this.modalClose();
    }
  }

  onClick(event) {
    // Close when layout was clicked
    if (event.target === this.layoutRef) {
      this.modalClose();
    }
  }

  modalClose() {
    const {
      modalComponentIm,
      modalComponentHideAllSignal,
      onClose
    } = this.props;

    if (!modalComponentIm.get('isDisabled')) {
      if (onClose !== undefined) {
        onClose();
      } else {
        modalComponentHideAllSignal();
      }
    }
  }

  render() {
    const {
      children,
      modalComponentIm,
      modalComponentHideSignal,
      modalComponentSubmitWrapperSignal,
      modalId,
      modalWrapperClassName = 'modal__wrapper',
    } = this.props;
    let modalBlock = null;

    if (modalComponentIm.get('activeId') === modalId) {
      modalBlock = (
        <div className="modal">
          <div
            className="modal__layout"
            ref={(ref) => { this.layoutRef = ref; }}
            onClick={this.onClick}
          >
            <div className={modalWrapperClassName}>
              {React.cloneElement(children, {
                modalComponentIm,
                modalComponentHideSignal,
                modalComponentSubmitWrapperSignal
              })}
            </div>
          </div>
        </div>
      );
    }

    return ReactDOM.createPortal((
      <CSSTransitionGroup
        component="div"
        transitionName="modal"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={200}
      >
        {modalBlock}
      </CSSTransitionGroup>
    ), modalRoot);
  }
}
