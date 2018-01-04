const util = require('util');

function InputError(message) {
  this.message = message;
  Error.captureStackTrace(this, InputError);
}
util.inherits(InputError, Error);
InputError.prototype.name = 'InputError';


function AuthorizeError(message) {
  this.message = message;
  Error.captureStackTrace(this, AuthorizeError);
}
util.inherits(AuthorizeError, Error);
AuthorizeError.prototype.name = 'AuthorizeError';


function PermissionError(message) {
  this.message = message;
  Error.captureStackTrace(this, PermissionError);
}
util.inherits(PermissionError, Error);
PermissionError.prototype.name = 'PermissionError';

function InternalError(message) {
  this.message = message;
  Error.captureStackTrace(this, InternalError);
}
util.inherits(InternalError, Error);
InternalError.prototype.name = 'InternalError';


module.exports = {
  InputError,
  AuthorizeError,
  PermissionError,
  InternalError,
};
