import React, { useContext, useEffect, useState } from 'react'
import { Button, Center, Header, Input, Spinner, Table } from '@/components'
import { CartContext } from '@/context/StateContext';
import axios from 'axios';
import styled from 'styled-components'
import { loadStripe } from '@stripe/stripe-js';
import { RevealWrapper } from 'next-reveal';
import { useSession } from 'next-auth/react';

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;

  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(2){
    text-align: right;
  }

  table tr.subtotal td{
    padding: 20px 0;
    /* border: none !important; */
  }

  table tr.subtotal td:nth-child(2){
    font-size: 1.2rem;
  }

  table tr.total td{
    padding: 20px 0;
    font-weight: bold;
  }

  @media screen and (min-width: 800px) {
    grid-template-columns: 1.3fr .7fr;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, .1);
`;

const ProductImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 2px;
  
  img{
    max-width: 70px;
    max-height: 70px;
  }

  @media screen and (min-width: 800px) {
    padding: 10px;
    width: 100px;
    height: 100px;

    img{
    max-width: 80px;
    max-height: 80px;
  }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  margin: 10px 0;
  @media screen and (min-width: 800px) {
    display: inline-block;
    padding: 0 15px;
    margin: 0;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`

const CartPage = () => {
  const { cartProducts, changeQty } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCiy] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const { data: session } = useSession();
  const [loaded, setLoaded] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    if (session) {

      setLoaded(true);
      axios.get('/api/address').then(response => {
        setName(response.data.name)
        setEmail(response.data.email);
        setCiy(response.data.city);
        setCountry(response.data.country);
        setPostalCode(response.data.postalCode);
        setStreetAddress(response.data.streetAddress);
        setLoaded(false);
      });
    }
  }, [session]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then(response => {
        setProducts(response.data);
      });

      axios.get('/api/settings?name=shippingFee').then(response => {
        setShippingFee(response.data.value);
      })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  let totalProducts = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    totalProducts += price;
  }
  
  let total = parseInt(shippingFee) + totalProducts;

  const checkOk = () => {
    if (name !== '' && email !== '' && city !== '' && postalCode !== '' && streetAddress !== '' && country) {
      goToPayment();
    } 
  }

  const goToPayment = async () => {
      const response = await axios.post('/api/checkout', {
        name, email, city, postalCode, streetAddress, country,
        cartProducts, total
      });
      if (response.data.url) {
        window.location = response.data.url;
      }  
  }


  return (
    <>
      <ColumnWrapper>
        <RevealWrapper>

          <Box>
            <h2>Cart</h2>
            {
              !cartProducts?.length && (
                <div>Your cart is empty</div>
              )
            }
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button
                          onClick={() => changeQty('dec', product._id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                        </QuantityLabel>
                        <Button
                          onClick={() => changeQty('inc', product._id)}>+</Button>
                      </td>
                      <td>${
                        product.price * cartProducts.filter(id => id === product._id).length
                      }</td>
                    </tr>
                  ))}
                  <tr  className='subtotal'>
                    <td colSpan={2}>Products</td>
                    <td>${totalProducts}</td>
                  </tr>
                  <tr  className='subtotal'> 
                    <td colSpan={2}>Shipping:</td>
                    <td>${shippingFee}</td>
                  </tr>
                  <tr className='total'> 
                    <td colSpan={2}>Total:</td>
                    <td>${total}</td>
                  </tr>
                </tbody>
              </Table>
            )}

          </Box>
        </RevealWrapper>

        {!!cartProducts?.length && (
          <>
             {loaded && (
               <Spinner fullWidth={true} />
               )}
           {!loaded && (

        
          <RevealWrapper delay={200}>
            <Box>
              <h2>Order Information</h2>
              <Input type='text'
                value={name}
                name='name'
                onChange={e => setName(e.target.value)}
                placeholder='Name'
              />
              <Input type='text'
                value={email}
                name='email'
                onChange={e => setEmail(e.target.value)}
                placeholder='Email'
              />
              <CityHolder>
                <Input type='text'
                  value={city}
                  name='city'
                  onChange={e => setCiy(e.target.value)}
                  placeholder='City'
                />
                <Input type='text'
                  value={postalCode}
                  name='postalCode'
                  onChange={e => setPostalCode(e.target.value)}
                  placeholder='Postal Code'
                />
              </CityHolder>
              <Input type='text'
                value={streetAddress}
                name='streetAddress'
                onChange={e => setStreetAddress(e.target.value)}
                placeholder='Street Address'
              />
              <Input type='text'
                value={country}
                name='country'
                onChange={e => setCountry(e.target.value)}
                placeholder='Country' />
              <Button primary block onClick={checkOk}>Continue to payment</Button>
            </Box>
          </RevealWrapper>
             )}    
          </>
        )}
      </ColumnWrapper>
    </>
  )
}

export default CartPage