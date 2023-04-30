import { mongooseConnect } from "@/lib/mongoose";
import { buffer } from "micro";
import { Order } from "@/models/Order";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = "whsec_b3ba03032d6624908af1b262b7f577aa8c7fc553a9af255b056b599f35092edf";

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];
  console.log('hhh', req.headers);
  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted  = event.data.object;

      const total = checkoutSessionCompleted.amount_total / 100;
      const name = checkoutSessionCompleted.metadata.name;
      const email = checkoutSessionCompleted.metadata.email;
      const city = checkoutSessionCompleted.metadata.city;
      const postalCode = checkoutSessionCompleted.metadata.postalCode;
      const streetAddress = checkoutSessionCompleted.metadata.streetAddress;
      const country = checkoutSessionCompleted.metadata.country;
      const line_items = JSON.parse(checkoutSessionCompleted.metadata.items);
      const paid = checkoutSessionCompleted.payment_status === 'paid';
     
      const order = { line_items, name, email, city, postalCode, streetAddress, country, paid, total}

      await Order.create(order);
      
      console.log('yes');

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // res.status(200).send('ok');
  res.send(200);
}

export const config = {
  api: { bodyParser: false, }
};