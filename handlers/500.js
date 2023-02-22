// function to catch any required errors at base of middleware stack

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    // used if error handling by express already in   progress
    return next(error);
  }
  response.status(500).send({ code: 500, route: request.path, message: error });
}

module.exports = errorHandler;
