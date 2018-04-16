import React, { Fragment, StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { Location } from 'history';
import { menu } from 'config';
import i18next from 'i18next';
import Tooltip from 'components/tooltip';
import Modal, { ModalSelectLanguage } from 'components/modal';
import { TState as TAuthState, actions as authActions } from 'ducks/data/auth';
import { actions as sidebarActions } from 'ducks/components/sidebar';
import { actions as modalActions } from 'ducks/components/modal';

interface IHeaderTooltipProps {
  onLanguageClick: () => void;
  onLogoutClick: () => void;
}
const HeaderTooltipContent: StatelessComponent<IHeaderTooltipProps> = ({
  onLanguageClick,
  onLogoutClick,
}) => (
  <Fragment>
    <Language onClick={onLanguageClick} />
    <Logout onClick={onLogoutClick} />
  </Fragment>
);

interface ILanguageProps {
  onClick: () => void;
}
const Language: StatelessComponent<ILanguageProps> = ({ onClick }) => (
  <div className="header__tooltip-item" onClick={onClick}>
    <span>{i18next.t('language')}</span>
    <i className="material-icons material-icons__size_20">language</i>
  </div>
);

interface ILogoutProps {
  onClick: () => void;
}
const Logout: StatelessComponent<ILogoutProps> = ({ onClick }) => (
  <div className="header__tooltip-item" onClick={onClick}>
    <span>{i18next.t('log_out')}</span>
    <i className="material-icons material-icons__size_20">exit_to_app</i>
  </div>
);

interface IUserProps {
  name: string;
}
const User: StatelessComponent<IUserProps> = ({ name }) => (
  <div className="header__user">
    <i className="material-icons">account_circle</i>
    <span className="header__link">{name}</span>
    <i className="material-icons">expand_more</i>
  </div>
);

interface ITextTitleProps {
  title?: string;
}
const TextTitle: StatelessComponent<ITextTitleProps> = ({ title = '' }) => (
  <span className="header__title">{i18next.t(title)}</span>
);

interface IHeaderProps {
  location: Location;
  authDataIm: TAuthState;
  authDataLogoutSignal: typeof authActions.authDataLogoutSignal;
  sidebarComponentToggleDelta: typeof sidebarActions.sidebarComponentToggleDelta;
  modalComponentShowSignal: typeof modalActions.modalComponentShowSignal;
}
const Header: StatelessComponent<IHeaderProps> = ({
  location,
  authDataIm,
  authDataLogoutSignal,
  sidebarComponentToggleDelta,
  modalComponentShowSignal,
}) => {
  const { pathname } = location;
  const headerTooltipContentBlock = (
    <HeaderTooltipContent
      onLanguageClick={() => modalComponentShowSignal('selectLanguage')}
      onLogoutClick={authDataLogoutSignal}
    />
  );
  const menuItem = menu.get(pathname, '');

  return (
    <header className="header">
      <div className="header__toggle-button" onClick={sidebarComponentToggleDelta} />
      <div className="header__logo">{i18next.t('helpdesk')}</div>

      <div className="header__content">
        <div className="header__center">
          <TextTitle title={menuItem !== '' ? menuItem.get('text', '') : undefined} />
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
              currentLanguage={authDataIm.getIn(['data', 'language'])}
            />
          </Modal>
        </div>
      </div>
    </header>
  );
};

const mapDispatchToProps = {
  authDataLogoutSignal: authActions.authDataLogoutSignal,
  sidebarComponentToggleDelta: sidebarActions.sidebarComponentToggleDelta,
  modalComponentShowSignal: modalActions.modalComponentShowSignal,
};

const mapStateToProps = state => ({
  authDataIm: state.data.authDataIm,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
