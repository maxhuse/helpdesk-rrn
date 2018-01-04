/*
* Компонент верхнего уровня.
* Проверка авторизации и прав пользователя на просмотр страницы
* */
import React, { PureComponent } from 'react';
import { rights } from 'config';
import Preloader from 'components/preloader';
import ServerError from 'components/server-error';

export default ComposedComponent => class CheckAuthHoc extends PureComponent {
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
      const startPage = rights[role][0];

      this.props.history.push(startPage);
    }

    this.setState({ isReady: true });
  }

  // проверяет имеет ли данная роль права на данный URL
  haveRights() {
    const role = this.props.authDataIm.getIn(['data', 'role']);
    const currentPath = this.props.location.pathname;

    if (!role) {
      return false;
    }

    const allowedPaths = rights[role];

    // находим текущий роут без подпутей
    // первый элемент пустая строка, т.к. / первый символ
    let [, currentRoute] = currentPath.split('/');

    // добавляем /, т.к. в массиве разрешенных путей они записаны со /
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
