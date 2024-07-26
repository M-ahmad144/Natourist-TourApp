//Inherit Error built in class
class AppErr extends Error {
  constructor(msg, statusCode) {
    super(msg);

    this.statusCode = statusCode; //there will go status code e.g 404
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppErr;
