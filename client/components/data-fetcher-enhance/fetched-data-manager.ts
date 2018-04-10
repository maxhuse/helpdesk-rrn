/*
* @key = fetch action name
* @value = fetch promise
* */

import Promise from 'bluebird';

interface IFetchedData {
  [key: string]: Promise<any>;
}

interface FetchedDataManager {
  clearFetchedData: () => void;
  getFetchedData: () => IFetchedData;
}

let fetchedData: IFetchedData = {};

const fetchedDataManager: FetchedDataManager = {
  clearFetchedData() {
    Object.keys(fetchedData).forEach((fetchActionName) => {
      fetchedData[fetchActionName].cancel();
    });

    fetchedData = {};
  },

  getFetchedData() {
    return fetchedData;
  },
};

export default fetchedDataManager;
