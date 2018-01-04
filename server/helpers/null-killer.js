/*
* Возвращает копию переданного в качетстве параметра объекта/массива
* у которой рекурсивно удалены все null/undefined поля
* */

const _ = require('lodash');

const nullKillerInner = (data) => {
  if (_.isArray(data)) {
    const nullKeys = [];

    data.forEach((element, dataKey) => {
      if (_.isNull(data[dataKey])) {
        nullKeys.push(dataKey);
      } else if (_.isObject(data[dataKey])) {
        nullKillerInner(data[dataKey]);
      }
    });

    nullKeys.forEach((keyToSplice) => {
      data.splice(keyToSplice, 1);
    });
  } else if (_.isObject(data)) {
    Object.keys(data).forEach((dataKey) => {
      if (_.isNull(data[dataKey])) {
        delete data[dataKey];
      } else if (_.isObject(data[dataKey])) {
        nullKillerInner(data[dataKey]);
      }
    });
  }
};

const nullKiller = (data) => {
  const resultData = _.cloneDeep(data);

  nullKillerInner(resultData);

  return resultData;
};

module.exports = nullKiller;
