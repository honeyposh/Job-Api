const { CustomAPIError } = require("../errors/customApiError");
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json(err.message);
};
module.exports = errorHandler;
