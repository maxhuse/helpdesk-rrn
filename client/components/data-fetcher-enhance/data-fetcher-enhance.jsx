/*
* HOC for data preload for a component
* */
import React, { PureComponent } from 'react';
import Preloader from 'components/preloader';
import ServerError from 'components/server-error';
import PropTypes from 'prop-types';
import fetchedDataManager from './fetched-data-manager';

const ServerErrorPage = () => (
  <div className="content">
    <div className="content__body">
      <ServerError />
    </div>
  </div>
);

const isErrorStatus = status => (status !== 200 && status !== 401 && status !== 403);

export default (ComposedComponent, CustomPreloader) =>
  class DataFetcherWrapper extends PureComponent {
    static propTypes = {
      fetchActionNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        isError: false,
      };

      this.Preloader = CustomPreloader || Preloader;
    }

    componentWillMount() {
      fetchedDataManager.clearFetchedData();

      const promises = [];
      const fetchedData = fetchedDataManager.getFetchedData();

      this.props.fetchActionNames.forEach((fetchActionName) => {
        if (!fetchedData[fetchActionName]) {
          fetchedData[fetchActionName] = this.props[fetchActionName]();
        }

        promises.push(fetchedData[fetchActionName]);
      });

      Promise.all(promises).then((data) => {
        const isError = data.some(({ status }) => isErrorStatus(status));

        if (isError) {
          this.setState({ isError: true });

          return;
        }

        this.setState({ isLoading: false });
      });
    }

    render() {
      if (this.state.isError) {
        return <ServerErrorPage />;
      }

      return this.state.isLoading ?
        <this.Preloader /> :
        <ComposedComponent {...this.props} />;
    }
  };
