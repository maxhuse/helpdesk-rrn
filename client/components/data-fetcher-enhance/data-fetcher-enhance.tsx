/*
* HOC for data preload for a component
* */
import React, { PureComponent, StatelessComponent, ComponentClass, ComponentType } from 'react';
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

interface IDataFetcherEnhance {
  (
    ComposedComponent: ComponentType<any>,
    customOptions?: { CustomPreloader?: ComponentType<any>, CustomServerError?:ComponentType<any> },
  ): ComponentClass<any>;
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
    private readonly Preloader: ComponentType | typeof Preloader;
    private readonly ServerError: ComponentType | typeof ServerErrorPage;

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

    componentDidMount() {
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

        if (isError) {
          this.setState({ isError: true });

          return;
        }

        this.setState({ isLoading: false });
      });
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
