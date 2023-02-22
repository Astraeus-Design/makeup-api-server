const axios = require("axios");

// product object class for use in returning object arrays to client

class productObj {
  constructor(inputObj) {
    this.name = inputObj.user.name;
    this.imageUrl = inputObj.urls.regular;
    this.description = inputObj.description;
  }
}

// route handler for makeup query search

async function getProducts(request, response, next) {
  try {
    console.log(request);
    const digiUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline`;
    const productData = await axios.get(digiUrl);
    //console.log(request.query);
    console.log(" here is the data   ", productData.data);
    //   imageData.data.results.map((item) => console.log(item));
    //   const digiData = imageData.data.results.map((item) => {
    //     console.log(item.description);
    //     return new imgObj(item);
    //   });
    response.status(200).send(productData.data);
  } catch (error) {
    console.log(error);
    next(`error in request for ${request.query.query} images`);
    //response.status(500).send("error in request for images");
  }
}

module.exports = getProducts;
