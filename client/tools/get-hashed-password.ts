/* eslint-disable new-cap */
import CryptoJS from 'crypto-js';

const getHashedPassword = (password: string): string => {
  let newPassword: string = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(password, 'PG83_@kF,VE#@NYy!lfP}vGeG^2N.dk')
  );

  newPassword = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(newPassword, 'md&m.se2@GE@_+2WMg;WrPgP_+VgH6!')
  );

  return newPassword;
};

export default getHashedPassword;
