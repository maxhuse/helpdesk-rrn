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

export default (ComposedComponent, customOptions = {}) =>
  class DataFetcherWrapper extends PureComponent {
    static propTypes = {
      fetchActionAttributes: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          options: PropTypes.object,
        })
      ).isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        isError: false,
      };

      const { CustomPreloader = false, CustomServerError = false } = customOptions;

      this.Preloader = CustomPreloader || Preloader;
      this.ServerError = CustomServerError || ServerErrorPage;
    }

    componentWillMount() {
      fetchedDataManager.clearFetchedData();

      const promises = [];
      const fetchedData = fetchedDataManager.getFetchedData();

      this.props.fetchActionAttributes.forEach(({ name, options }) => {
        if (!fetchedData[name]) {
          fetchedData[name] = this.props[name](options);
        }

        promises.push(fetchedData[name]);
      });

      Promise.all(promises).then((data) => {
        const isError = data.some(({ status }) => isErrorStatus(status));

        if (this.mounted !== true) {
          return;
        }

        if (isError) {
          this.setState({ isError: true });

          return;
        }

        this.setState({ isLoading: false });
      });
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      if (this.state.isError) {
        return <this.ServerError />;
      }

      return this.state.isLoading ?
        <this.Preloader /> :
        <ComposedComponent {...this.props} />;
    }
  };
