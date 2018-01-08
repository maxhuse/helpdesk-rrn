import React, { Fragment } from 'react';
import { menu } from 'config';
import i18next from 'i18next';
import Tooltip from 'components/tooltip';
import Modal from 'containers/modal';
import ModalSelectLanguage from 'components/modal/select-language';

const HeaderTooltipContent = ({ onLanguageClick, onLogoutClick }) => (
  <Fragment>
    <Language onClick={onLanguageClick} />
    <Logout onClick={onLogoutClick} />
  </Fragment>
);

const Language = ({ onClick }) => (
  <div className="header__tooltip-item" onClick={onClick}>
    <span>{i18next.t('language')}</span>
    <i className="material-icons material-icons__size_20">language</i>
  </div>
);

const Logout = ({ onClick }) => (
  <div className="header__tooltip-item" onClick={onClick}>
    <span>{i18next.t('log_out')}</span>
    <i className="material-icons material-icons__size_20">exit_to_app</i>
  </div>
);

const User = ({ name }) => (
  <div className="header__user">
    <i className="material-icons">account_circle</i>
    <span className="header__link">{name}</span>
    <i className="material-icons">expand_more</i>
  </div>
);

const TextTitle = ({ title = '' }) => (
  <span className="header__title">{i18next.t(title)}</span>
);

export default function Header(
  {
    authDataIm,
    sidebarComponentToggleDelta,
    authDataLogoutSignal,
    location,
    authDataSetLanguageDelta,
    modalComponentShowDelta,
  }
) {
  const { pathname } = location;
  const headerTooltipContentBlock = (
    <HeaderTooltipContent
      onLanguageClick={() => modalComponentShowDelta('selectLanguage')}
      onLogoutClick={authDataLogoutSignal}
    />
  );

  return (
    <header className="header">
      <div className="header__toggle-button" onClick={sidebarComponentToggleDelta} />
      <div className="header__logo">{i18next.t('helpdesk')}</div>

      <div className="header__content">
        <div className="header__center">
          <TextTitle title={menu.get(pathname).get('text')} />
        </div>

        <div className="header__right">
          <Tooltip
            content={headerTooltipContentBlock}
            className="tooltip__content_header"
          >
            <User name={authDataIm.getIn(['data', 'name'])} />
          </Tooltip>

          <Modal modalId="selectLanguage">
            <ModalSelectLanguage
              setLanguageDelta={authDataSetLanguageDelta}
              currentLanguage={authDataIm.getIn(['data', 'language'])}
            />
          </Modal>
        </div>
      </div>
    </header>
  );
}
