/*
* This component should be rendered only once,
* somewhere in the top level of DOM
* */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { TState } from 'ducks/components/modal';

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});

const modalRoot = document.getElementById('modal-root');

// Protection against the closing animation of an unopened window
let isModalBackgroundWasOpened = false;

interface IProps {
  modalComponentIm: TState,
}
class ModalBackground extends PureComponent<IProps> {
  render() {
    if (!modalRoot) {
      return null;
    }

    const { modalComponentIm } = this.props;
    // Displayed only if there are active modal windows
    const hasModals = modalComponentIm.queue.size > 0;
    const className = classnames(
      'modal-background',
      { 'modal-background_visible': hasModals },
      { 'modal-background_hidden': !hasModals && isModalBackgroundWasOpened },
    );

    isModalBackgroundWasOpened = hasModals;

    // Remove the scrolling from the body while opening the modal window.
    // This can be done through the class.
    document.body.style.overflowY = hasModals ? 'hidden' : '';

    return ReactDOM.createPortal(<div className={className} />, modalRoot);
  }
}

export default connect(mapStateToProps)(ModalBackground);
