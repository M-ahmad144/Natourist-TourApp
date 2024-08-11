const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //If fn returns a promise that rejects, .catch(next) passes the error to the next middleware which is global error handling.
  };
};

module.exports = catchAsync;
