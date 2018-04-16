import React, { MouseEvent, PureComponent, ReactElement } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { actions as modalComponentActions, TState } from 'ducks/components/modal';

const mapDispatchToProps = ({
  modalComponentHideSignal: modalComponentActions.modalComponentHideSignal,
  modalComponentHideAllSignal: modalComponentActions.modalComponentHideAllSignal,
  modalComponentSubmitWrapperSignal: modalComponentActions.modalComponentSubmitWrapperSignal,
});

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});


const modalRoot = document.getElementById('modal-root');

interface IProps {
  modalId: string;
  modalWrapperClassName?: string;
  onClose?: () => void;
  modalComponentIm: TState,
  modalComponentHideSignal: typeof modalComponentActions.modalComponentHideSignal,
  modalComponentHideAllSignal: typeof modalComponentActions.modalComponentHideAllSignal,
  modalComponentSubmitWrapperSignal: typeof modalComponentActions.modalComponentSubmitWrapperSignal,
  children: ReactElement<any>;
}
class Modal extends PureComponent<IProps> {
  private layoutRef: HTMLDivElement | null;

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

  private onKeyup(event): void {
    // Close all windows when pressing Esc.
    // Only the active window listens events to avoid unnecessary computations.
    if (event.keyCode === 27 &&
      this.props.modalComponentIm.activeId === this.props.modalId
    ) {
      this.modalClose();
    }
  }

  private onClick(event: MouseEvent<HTMLDivElement>): void {
    // Close when layout was clicked
    if (event.target === this.layoutRef) {
      this.modalClose();
    }
  }

  private modalClose(): void {
    const {
      modalComponentIm,
      modalComponentHideAllSignal,
      onClose
    } = this.props;
    if (!modalComponentIm.isDisabled) {
      if (onClose !== undefined) {
        onClose();
      } else {
        modalComponentHideAllSignal();
      }
    }
  }

  render() {
    if (!modalRoot) {
      return null;
    }

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
        in={modalComponentIm.activeId === modalId}
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
