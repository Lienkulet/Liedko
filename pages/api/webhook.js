import { mongooseConnect } from "@/lib/mongoose";
import { buffer } from "micro";
import { Order } from "@/models/Order";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];

  try {
    const buf = await buffer(req);
    const event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted  = event.data.object;

        const total = checkoutSessionCompleted.amount_total;
        const name = checkoutSessionCompleted.metadata.name;
        const email = checkoutSessionCompleted.metadata.email;
        const city = checkoutSessionCompleted.metadata.city;
        const postalCode = checkoutSessionCompleted.metadata.postalCode;
        const streetAddress = checkoutSessionCompleted.metadata.streetAddress;
        const country = checkoutSessionCompleted.metadata.country;
        const line_items = JSON.parse(checkoutSessionCompleted.metadata.items);
        const paid = checkoutSessionCompleted.payment_status === 'paid';

        // Create order
        const order = {
          line_items,
          name,
          email,
          city,
          postalCode,
          streetAddress,
          country,
          paid,
          total,
        };

        await Order.create(order);

        // Send response to client
        res.status(200).send('success');

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

export const config = {
  api: { bodyParser: false, }
};
