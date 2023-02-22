// function to validate existence of query string

function fourofour(request, response, next) {
  console.log("in 404 or 401 error");

  response.status(404).send(`route requested does not exist ${request.path}`);
}

module.exports = fourofour;
