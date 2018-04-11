import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { rights } from 'config';
import Toasts from 'components/toasts';
import ServerError from 'components/server-error';
import Preloader from 'components/preloader';
import { fetchedDataManager } from 'components/data-fetcher-enhance';
import AuthForm from './auth-form';

export default class Auth extends PureComponent {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      fetchStatus: 'IN_PROGRESS',
    };
  }

  componentDidMount() {
    fetchedDataManager.clearFetchedData();

    this.props.authDataGetWithNoErrorsSignal().then(({ status }) => {
      if (status !== 401 && status !== 403 && status !== 200) {
        this.setState({ fetchStatus: 'ERROR' });

        return;
      }

      this.setState({ fetchStatus: 'DONE' });
      this.checkAuth();
    });
  }

  componentWillUnmount() {
    this.props.toastsComponentResetDelta();
  }

  onSubmit(event) {
    event.preventDefault();

    const login = this.formRef.login.value;
    const password = this.formRef.password.value;

    if (this.validation({ login, password })) {
      this.props.authDataLoginSignal({ data: { login, password } })
        .then(({ status, data = {} }) => {
          if ((status === 401 || status === 403) && data.message) {
            this.props.toastsComponentAddDelta({ type: 'info', content: i18next.t(data.message) });
          }

          this.checkAuth();
        });
    }
  }

  checkAuth() {
    if (this.props.authDataIm.getIn(['data', 'login'])) {
      const role = this.props.authDataIm.getIn(['data', 'role']);
      const startPage = rights[role][0];

      this.props.history.push(startPage);
    }
  }

  validation({ login, password }) {
    let isValid = true;

    if (!login) {
      this.formRef.login.error = i18next.t('v.required');
      isValid = false;
    }

    if (!password) {
      this.formRef.password.error = i18next.t('v.required');
      isValid = false;
    }

    return isValid;
  }

  render() {
    let content;

    switch (this.state.fetchStatus) {
      case 'DONE':
        content = (
          <AuthForm
            onSubmit={this.onSubmit}
            ref={(ref) => { this.formRef = ref; }}
          />
        );
        break;

      case 'ERROR':
        content = <ServerError />;
        break;

      case 'IN_PROGRESS':
      default:
        content = <Preloader />;
    }

    return (
      <Fragment>
        {content}

        <Toasts />
      </Fragment>
    );
  }
}
