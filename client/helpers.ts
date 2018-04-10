import moment from 'moment';

export const getFormatDate = (timestamp: number): string | undefined => {
  if (!timestamp) {
    return undefined;
  }

  return moment(timestamp, 'X').format('DD MMMM YYYY');
};

export const getFormatDateTime = (timestamp: number): string | undefined => {
  if (!timestamp) {
    return undefined;
  }

  return moment(timestamp, 'X').format('DD MMMM YYYY HH:mm');
};
