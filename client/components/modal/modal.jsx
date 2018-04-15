import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { actions as modalComponentActions } from 'ducks/components/modal';

const mapDispatchToProps = Object.assign(
  {},
  modalComponentActions
);

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});


const modalRoot = document.getElementById('modal-root');

class Modal extends PureComponent {
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

    return ReactDOM.createPortal((
      <CSSTransition
        in={modalComponentIm.get('activeId') === modalId}
        classNames="modal"
        timeout={{ enter: 300, exit: 200 }}
        unmountOnExit
      >
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
      </CSSTransition>
    ), modalRoot);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
