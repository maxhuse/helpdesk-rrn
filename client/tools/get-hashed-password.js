/* eslint-disable new-cap */
const CryptoJS = require('crypto-js');

const getHashedPassword = (password) => {
  let newPassword = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(password, 'PG83_@kF,VE#@NYy!lfP}vGeG^2N.dk')
  );

  newPassword = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA512(newPassword, 'md&m.se2@GE@_+2WMg;WrPgP_+VgH6!')
  );

  return newPassword;
};

module.exports = getHashedPassword;
