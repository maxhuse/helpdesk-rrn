import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Auth } from 'components/pages';
import { App } from 'containers';

export default (
  <Switch>
    {/* redirect */}
    <Redirect from="/tickets/:something" to="/tickets" />
    <Redirect from="/customers/:something" to="/customers" />
    <Redirect from="/staffs/:something" to="/staffs" />
    <Redirect from="/profile/:something" to="/profile" />

    {/* auth page */}
    <Route path="/auth" component={Auth} />

    {/* app pages */}
    <Route component={App} />
  </Switch>
);
