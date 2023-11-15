const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-error");
const UnauthorizedError = require("./unauthenticated");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthorizedError,
};
