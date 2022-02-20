
const catchAsyncError = (asynFunc) => {
  // Return the implementation to handle the all async function error
  return (req, res, next) => {
    asynFunc(req, res, next).catch(err => { next(err) });
  };
};

export default catchAsyncError;
