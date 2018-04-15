import React, { PureComponent, Fragment, MouseEvent } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { History } from 'history';
import { actions as authDataActions, TState as TAuthState } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';
import { rights } from 'config';
import Toasts from 'components/toasts';
import ServerError from 'components/server-error';
import Preloader from 'components/preloader';
import { fetchedDataManager } from 'components/data-fetcher-enhance';
import AuthForm from './auth-form';

const mapDispatchToProps = dispatch => ({
  dispatch,
  toastsComponentAddDelta: toastsComponentActions.toastsComponentAddDelta,
  toastsComponentResetDelta: toastsComponentActions.toastsComponentResetDelta,
  authDataGetWithNoErrorsSignal: authDataActions.authDataGetWithNoErrorsSignal,
  authDataLoginSignal: authDataActions.authDataLoginSignal,
});

const mapStateToProps = state => ({ authDataIm: state.data.authDataIm });

interface IAuthProps {
  authDataIm: TAuthState;
  authDataLoginSignal: typeof authDataActions.authDataLoginSignal;
  authDataGetWithNoErrorsSignal: typeof authDataActions.authDataGetWithNoErrorsSignal;
  toastsComponentAddDelta: typeof toastsComponentActions.toastsComponentAddDelta;
  toastsComponentResetDelta: typeof toastsComponentActions.toastsComponentResetDelta;
  history: History;
  dispatch: Dispatch<any>;
}
interface IAuthState {
  fetchStatus: 'IN_PROGRESS' | 'DONE' | 'ERROR';
}
class Auth extends PureComponent<IAuthProps, IAuthState> {
  private formRef: AuthForm | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      fetchStatus: 'IN_PROGRESS',
    };
  }

  componentDidMount() {
    fetchedDataManager.clearFetchedData();

    this.props.dispatch(this.props.authDataGetWithNoErrorsSignal()).then(({ status }) => {
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

  private onSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!this.formRef || !this.formRef.login || !this.formRef.password) {
      return;
    }

    const login = this.formRef.login.value;
    const password = this.formRef.password.value;

    if (this.validation({ login, password })) {
      this.props.dispatch(this.props.authDataLoginSignal({ data: { login, password } }))
        .then(({ status, data = {} }) => {
          if ((status === 401 || status === 403) && data.message) {
            this.props.toastsComponentAddDelta({ type: 'info', content: i18next.t(data.message) });
          }

          this.checkAuth();
        });
    }
  }

  private checkAuth(): void {
    if (this.props.authDataIm.getIn(['data', 'login'])) {
      const role = this.props.authDataIm.getIn(['data', 'role']);
      const startPage = rights[role][0];

      this.props.history.push(startPage);
    }
  }

  private validation({ login, password }: { login: string, password: string }): boolean {
    let isValid = true;

    if (!login && (this.formRef !== null && this.formRef.login !== null)) {
      this.formRef.login.error = i18next.t('v.required');
      isValid = false;
    }

    if (!password && (this.formRef !== null && this.formRef.password !== null)) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
