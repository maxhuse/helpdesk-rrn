/*
* High Order Component
* Verify authorization and rights of the user to view the page
* */
import React, { PureComponent } from 'react';
import { rights } from 'config';
import Preloader from 'components/preloader';
import ServerError from 'components/server-error';

export default ComposedComponent => class CheckAuthEnhance extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      isError: false,
    };
  }

  componentDidMount() {
    this.props.authDataGetSignal().then(({ status }) => {
      switch (status) {
        case 200:
          this.checkRights();
          break;

        case 401:
        case 403:
          break; // do nothing

        default:
          this.setState({ isError: true });
      }
    });
  }

  componentWillUnmount() {
    this.props.toastsComponentResetDelta();
  }

  checkRights() {
    if (!this.haveRights()) {
      const role = this.props.authDataIm.getIn(['data', 'role']);
      // Get the first available route for this role
      const startPage = rights[role][0];

      this.props.history.push(startPage);
    }

    this.setState({ isReady: true });
  }

  // Checks that the role have rights for this URL
  haveRights() {
    const role = this.props.authDataIm.getIn(['data', 'role']);
    const currentPath = this.props.location.pathname;

    if (!role) {
      return false;
    }

    const allowedPaths = rights[role];

    // Find current route without subroutes
    // First element is empty string because "/" is first symbol
    let [, currentRoute] = currentPath.split('/');

    // Add "/" because in array of available routes they start with "/"
    currentRoute = `/${currentRoute}`;

    return allowedPaths.some(allowedPath => allowedPath === currentRoute);
  }

  render() {
    if (this.state.isReady) {
      return <ComposedComponent {...this.props} />;
    }

    if (this.state.isError) {
      return <ServerError />;
    }

    return <Preloader />;
  }
};
