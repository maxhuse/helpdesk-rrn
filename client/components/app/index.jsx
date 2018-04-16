import React from 'react';
import Toasts from 'components/toasts';
import { Profile, Tickets, Customers, Staffs } from 'components/pages';
import checkAuthEnhance from 'components/check-auth-enhance';
import { ModalBackground } from 'components/modal';
import { Switch, Route } from 'react-router-dom';
import Header from './header';
import SidebarMenu from './sidebar-menu';

const App = ({ location, sidebarComponentIm }) => (
  <div className="wrapper">
    <Header location={location} />

    <aside
      className={sidebarComponentIm.get('isShownOnMobile') ? 'sidebar sidebar_shown' : 'sidebar'}
    >
      <SidebarMenu />
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


export default checkAuthEnhance(App);
