import React from 'react';
import Toasts from 'components/toasts';
import { Profile, Tickets, Customers, Staffs } from 'components/pages';
import checkAuthEnhance from 'components/check-auth-enhance';
import { ModalBackground } from 'containers/modal';
import { Switch, Route } from 'react-router-dom';
import Header from './header';
import SidebarMenu from './sidebar-menu';

function App({
  authDataIm,
  authDataSetLanguageDelta,
  location,
  authDataLogoutSignal,
  sidebarComponentToggleDelta,
  sidebarComponentIm,
  modalComponentHideSignal,
  modalComponentShowDelta,
}) {
  return (
    <div className="wrapper">
      <Header
        authDataLogoutSignal={authDataLogoutSignal}
        sidebarComponentToggleDelta={sidebarComponentToggleDelta}
        location={location}
        authDataIm={authDataIm}
        authDataSetLanguageDelta={authDataSetLanguageDelta}
        modalComponentShowDelta={modalComponentShowDelta}
        modalComponentHideSignal={modalComponentHideSignal}
      />

      <aside
        className={sidebarComponentIm.get('isShownOnMobile') ? 'sidebar sidebar_shown' : 'sidebar'}
      >
        <SidebarMenu authDataIm={authDataIm} />
      </aside>

      <Switch>
        <Route path="/tickets" component={Tickets} />
        <Route path="/customers" component={Customers} />
        <Route path="/staffs" component={Staffs} />
        <Route path="/profile" component={Profile} />
      </Switch>

      <ModalBackground />

      <Toasts />
    </div>
  );
}

export default checkAuthEnhance(App);
