module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// const catchError = (fn = (req, res, next) => {
//   try {
//     fn(req, res, next);
//   } catch (err) {
//     next(err);
//   }
// });
// const catchError = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)
