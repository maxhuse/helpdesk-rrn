/* global document */

/*
* Данный компонент должен быть отрисован лишь один раз,
* где-нибудь в верхнем уровне DOM приложения
* */

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

// Защита от анимации закрытия еще неоткрытого окна
let isModalBackgroundWasOpened = false;

export default class ModalBackground extends PureComponent {
  render() {
    const { modalComponentIm } = this.props;
    // Отображается только при наличии активных модальных окон
    const hasModals = modalComponentIm.get('queue').size > 0;
    const className = classnames(
      'modal-background',
      { 'modal-background_visible': hasModals },
      { 'modal-background_hidden': !hasModals && isModalBackgroundWasOpened },
    );

    isModalBackgroundWasOpened = hasModals;

    // Убираем прокрутку у body на время открытия модального окна
    // Это можно сделать через класс (если у body будет таковой)
    document.body.style.overflowY = hasModals ? 'hidden' : '';

    return ReactDOM.createPortal(<div className={className} />, modalRoot);
  }
}
