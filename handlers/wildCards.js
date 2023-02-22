// route handler for wildcard routes, i.e those not existing

function wildCards(request, response) {
  response.status(404).send("file not found");
}

module.exports = wildCards;
