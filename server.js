"use strict";

const express = require("express"); // npm install express

//const axios = require("axios");
const logger = require("./middlewares/logger");
const validate = require("./middlewares/validate");
const errorHandler = require("./handlers/500");
const fourofour = require("./handlers/404");
//const routeHandlers = require("./handlers/routeHandlers");
//const { getImages } = require("./handlers/routeHandlers");
//const getRandom = require("./handlers/getRandom");
const wildCards = require("./handlers/wildCards");
const getProducts = require("./handlers/products");
const Ajv = require("ajv");

require("dotenv").config(); // npm i dotenv
const mongoose = require("mongoose");
const DEFAULT_PORT = 3001;
const PORT = process.env.PORT || DEFAULT_PORT;

// connect app to the mongo database cats

async function connectdb() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/makeupCollection", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("connected");

    // });
  } catch (error) {
    console.log(error);
  }
}

connectdb();

// Collection: schema and model

// schema is the blueprint or shape for our collection

const makeupSchema = mongoose.Schema({
  name: String,
  brand: String,
  price: String,
  imageUrl: String,
  description: String,
});

const cosmeticsModel = mongoose.model("cosmetics", makeupSchema);

// function to seed test values

function seedCollection() {
  const product1 = new cosmeticsModel({
    name: "mineral powder foundation",
    brand: "maybelline",
    price: "14.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/c77ad2da76259cfd67a9a9432f635bfb_ra,w158,h184_pa,w158,h184.png",
    description:
      "Why You'll Love ItMineral Power Powder Foundation with micro-minerals provides a more natural, healthier, luminous look.\nDiscover the natural power of micro-minerals:\n100% natural mica creates a more natural luminosity Complete, yet refined coverage Provides buildable, even coverage Preservative-free, talc-free, oil-free, fragrance-free Medium to Full Coverage",
  });

  const product2 = new cosmeticsModel({
    name: "eyestudio concentrated crayons",
    brand: "maybelline",
    price: "10.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/3f9f894b56e0616e44c5ee01dea45217_ra,w158,h184_pa,w158,h184.png",
    description:
      "Maybelline Eyestudio Color Tattoo Concentrated Crayons give you high-intensity color that looks vibrant all-day long.Features:Smooth, soft creamy finishPlayful intense colorsAll day tattoo tenacity. Playful color intensity. In an easy glide on crayon.",
  });

  const product3 = new cosmeticsModel({
    name: "colour sensational lipstick",
    brand: "maybelline",
    price: "9.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/fb9e6485500135d94163577da4c3579b_ra,w158,h184_pa,w158,h184.png",
    description:
      "\n                       \n\tMaybelline Color Sensational® Rebel Bloom lipstick offers vivacious pastels in a super-saturated lipcolour. Enjoy the kicky bouquet of lip colors in \npinks, reds and mauves.  Features:Super-saturated pigments take fresh picked pastels to a new bright\nNever dull, washed out or shy\nHoney nectar adds a sumptuous feel\n\n\t\tApplication: Apply lipcolor starting in the center of your upper lip. Work\n from the center to the outer edges of your lip, following the contours \nof your mouth. Then glide across the entire bottom lip.\n\n\t\t\n\t\n\n                    ",
  });

  const product4 = new cosmeticsModel({
    name: "lash brushes",
    brand: "maybelline",
    price: "12.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/a28e1387642c86f2d2e0cf446b2137aa_ra,w158,h184_pa,w158,h184.png",
    description:
      "2 brushes. 2x more impact!Now get bigger eyes with 360 degrees of false \nlash glam volume! Upper lashes get over-the-top glam with the upper \nbrush, while the lower brush grabs every tiny lower lash for a full \ncircle effect.For best results: Apply the Upper Brush against the top lid lashes and sweep from\n root to tip until a clean, voluminous look is achieved, followed by the\n lower lash line using the lower Micro Brush. Do not let dry between \ncoats. Removes easily with soap and water or with Maybelline® Clean \nExpress!™ Classic Eye Makeup Remover.\n",
  });

  product1.save();
  product2.save();
  product3.save();
  product4.save();
}

//  function to act as handler returning contents of cosmetics collection

async function getItems(req, res) {
  cosmeticsModel.find({}, (error, items) => {
    if (error) {
      console.log(`there was an error getting products ${error}`);
    } else {
      res.status(200).send(items);
    }
  });
}

// handler for receiving new item request and data from client

async function postHandler(req, res) {
  // get data from client, if object does not match object structure send error

  const ajv = new Ajv(); // create a validator for passed data

  const schema = {
    // create a schema to match data
    type: "object",
    properties: {
      name: { type: "string" },
      brand: { type: "string" },
      price: { type: "string" },
      imageUrl: { type: "string" },
      description: { type: "string" },
    },
    required: ["name", "brand", "price", "imageUrl", "description"],
  };

  const clientData = req.body;

  const validate = ajv.compile(schema); // create validator around schema
  const valid = validate(clientData); // validate recieved client data
  if (!valid)
    res.status(500).send({ error: "500", errType: "incorrect object format" });
  // if not valid send error response otherwise update database and send response with all items in collection
  else {
    try {
      const name = clientData.name;
      const brand = clientData.brand;
      const price = clientData.price;
      const imageUrl = clientData.imageUrl;
      const description = clientData.description;

      const newItem = await cosmeticsModel.create({
        name,
        brand,
        price,
        imageUrl,
        description,
      });
      cosmeticsModel.find({}, (err, cosmetics) => {
        if (err) {
          res.status(500).send("error searching for cosmetics");
        } else {
          res.status(200).send(cosmetics);
        }
      });
    } catch (error) {
      res.status(500).send("error handling data");
    }
  }
}

//seedCollection();   // comment out after initial write

//schema: drawing phase
// model: creation phase

//const testModel = mongoose.model("testParts", testSchema);

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/productsAPI", getProducts); // removed validate middleware temporarily

app.get("/product", getItems);
app.post("/product", postHandler);

//app.get("/randomimage", getRandom);
app.get("*", fourofour, wildCards);

app.use(errorHandler); // final catchall error routine

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

module.exports = {
  app: app,
};
