import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Settings } from "@/models/Settings";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }
  const {
    name, email, city,
    postalCode, streetAddress, country,
    cartProducts, total
  } = req.body;

  await mongooseConnect();

  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'USD',
          product_data: { name: productInfo.title },
          unit_amount: productInfo.price * 100,
        },
      });
    }
  }

  const shippingFeeSetting = await Settings.findOne({name:'shippingFee'});
  const shippingFee = parseInt(shippingFeeSetting.value || '0') * 100;

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    customer_email: email,
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Shipping Fee',
          type: 'fixed_amount',
          fixed_amount: {
            amount: shippingFee, 
            currency: 'USD'
          }
        }
      }
    ],
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/canceled`,
    metadata: {
      total: total.toString(),
      name: name.toString(),
      email: email.toString(),
      city: city.toString(),
      postalCode: postalCode.toString(),
      streetAddress: streetAddress.toString(),
      country: country.toString(),
      items: JSON.stringify(line_items),
    },
  
  });

  res.json({
    url: session.url,
  })
}
