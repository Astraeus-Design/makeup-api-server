// function to validate existence of query string

function validate(request, response, next) {
  console.log(request.query.query);
  if (!request.query.query) {
    console.log("error 404");
    response.status(404).send("missing query string");
  } else {
    next();
  }
}

module.exports = validate;
