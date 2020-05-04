require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// TODO: Add stripe key
const stripe = require("stripe")(process.env.SECRETKEY);
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Actual routes goes here
app.get("/", (req, res) => {
   res.send("Home Page");
});

app.post("/payment", (req, res) => {
   const { product, token } = req.body;
   console.log("Product: ", product);
   console.log("Price: ", product.price);

   const idempotencyKey = uuidv4();
   return stripe.customers
      .create({
         email: token.email,
         source: token.id,
      })
      .then((customer) => {
         stripe.charges.create(
            {
               amount: product.price * 100,
               currency: "usd",
               customer: customer.id,
               receipt_email: token.email,
               description: `Purchase of ${product}`,
               shipping: {
                  name: token.card.name,
                  address: {
                     country: token.card.address_country,
                  },
               },
            },
            { idempotencyKey }
         );
      })
      .then((result) => res.status(200).json(result))
      .catch((err) => console.log(err));
});
app.listen(port, () =>
   console.log(`Server is running on localhost at port ${port}`)
);
