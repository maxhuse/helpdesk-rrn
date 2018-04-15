/*
* HOC for data preload for a component
* */
import React, { PureComponent, StatelessComponent, ComponentClass } from 'react';
import Promise from 'bluebird';
import Preloader from 'components/preloader';
import ServerError from 'components/server-error';
import fetchedDataManager from './fetched-data-manager';

const ServerErrorPage: StatelessComponent = () => (
  <div className="content">
    <div className="content__body">
      <ServerError />
    </div>
  </div>
);

type IsErrorStatus = (status: number) => boolean;
const isErrorStatus: IsErrorStatus = status => (status !== 200 && status !== 401 && status !== 403);

type ReactComponent = ComponentClass | StatelessComponent;
interface IDataFetcherEnhance {
  (
    ComposedComponent: ReactComponent,
    customOptions?: { CustomPreloader?: ReactComponent, CustomServerError?: ReactComponent },
  ): ComponentClass;
}
interface IWrapperProps {
  fetchActionAttributes: { name: string, options?: object }[];
}
interface IWrapperState {
  isLoading: boolean;
  isError: boolean;
}
const dataFetcherEnhance: IDataFetcherEnhance = (ComposedComponent, customOptions = {}) =>
  class DataFetcherWrapper extends PureComponent<IWrapperProps, IWrapperState> {
    private mounted: boolean;
    private readonly Preloader: ReactComponent | typeof Preloader;
    private readonly ServerError: ReactComponent | typeof ServerErrorPage;

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

      const promises: Promise<any>[] = [];
      const fetchedData = fetchedDataManager.getFetchedData();

      this.props.fetchActionAttributes.forEach(({ name, options }) => {
        if (!fetchedData[name]) {
          fetchedData[name] = this.props[name](options);
        }

        promises.push(fetchedData[name]);
      });

      Promise.all(promises).then((data: { status: number }[]) => {
        const isError = data.some(({ status }) => isErrorStatus(status));

        if (!this.mounted) {
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

export default dataFetcherEnhance;
