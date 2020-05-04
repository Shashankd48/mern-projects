import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import "./App.css";
export default function App() {
   const [product, setProduct] = useState({
      name: "React from facebook",
      price: 20,
      productBy: "Facebook",
   });
   const makePayment = (token) => {
      const body = {
         token,
         product,
      };
      const header = {
         "Content-Type": "application/json",
      };
      return fetch(`http://localhost:5000/payment`, {
         method: "POST",
         headers: header,
         body: JSON.stringify(body),
      })
         .then((response) => {
            console.log(response);
            const { status } = response;
            console.log("STATUS: ", status);
         })
         .catch((err) => console.log(err));
   };
   return (
      <div className="container">
         <div className="col 4">
            <div className="card blue-grey darken-1">
               <h3 className="white-text center-align">Stripe Payment</h3>
               <StripeCheckout
                  stripeKey={process.env.REACT_APP_KEY}
                  toke={makePayment}
                  name="Buy React"
                  amount={product.price * 100}
                  shippingAddress
                  billingAddress
               >
                  <button className="btn-large pink">
                     Buy react in just {product.price}$
                  </button>
               </StripeCheckout>
            </div>
         </div>
      </div>
   );
}
