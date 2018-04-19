import React, { StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Location } from 'history';
import Toasts from 'components/toasts';
import { Profile, Tickets, Customers, Staffs } from 'components/pages';
import checkAuthEnhance from 'components/app/check-auth-enhance';
import { ModalBackground } from 'components/modal';
import { actions as authActions, TState as TAuthState } from 'ducks/data/auth';
import { TState as TSidebarState } from 'ducks/components/sidebar';
import { actions as toastsActions } from 'ducks/components/toasts';
import Header from './header';
import SidebarMenu from './sidebar-menu';

interface IProps {
  location: Location;
  authDataIm: TAuthState;
  sidebarComponentIm: TSidebarState;
}
const App: StatelessComponent<IProps> = ({ location, sidebarComponentIm, authDataIm }) => (
  <div className="wrapper">
    <Header location={location} />

    <aside
      className={sidebarComponentIm.isShownOnMobile ? 'sidebar sidebar_shown' : 'sidebar'}
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

const mapDispatchToProps = dispatch => ({
  dispatch,
  toastsComponentResetDelta: toastsActions.toastsComponentResetDelta,
  authDataGetSignal: authActions.authDataGetSignal,
});

const mapStateToProps = state => ({
  authDataIm: state.data.authDataIm,
  sidebarComponentIm: state.components.sidebarComponentIm,
});
const CheckAuth = checkAuthEnhance(App);

export default connect(mapStateToProps, mapDispatchToProps)(CheckAuth);
