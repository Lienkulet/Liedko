import { mongooseConnect } from "@/lib/mongoose";
import { buffer } from "micro";
import { Order } from "@/models/Order";

export const config = {
  api: { bodyParser: false, }
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const signingSecret = process.env.NEXT_SIGNIN_SECRET

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];

  let event;
  const buf = await buffer(req);
  const rawBody = buf.toString();

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, signingSecret);
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

