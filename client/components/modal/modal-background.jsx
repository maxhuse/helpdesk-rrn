/* global document */

/*
* This component should be rendered only once,
* somewhere in the top level of DOM
* */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

// Protection against the closing animation of an unopened window
let isModalBackgroundWasOpened = false;

export default class ModalBackground extends PureComponent {
  render() {
    const { modalComponentIm } = this.props;
    // Displayed only if there are active modal windows
    const hasModals = modalComponentIm.get('queue').size > 0;
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
