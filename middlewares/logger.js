// function to console log a date and time for a url event

function logger(req, res, next) {
  console.log(`url event of type ${req.method} at ${new Date()}`);
  next();
}

module.exports = logger;
