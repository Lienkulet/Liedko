import React, { useContext } from 'react'
import { Button, ProductBox } from '.';
import styled from 'styled-components';
import { RevealWrapper } from 'next-reveal';
import { CartContext } from '@/context/StateContext';
import { signIn } from 'next-auth/react';
import Title from './Title';

const StyledProductsGrid = styled.div`
  display: flex;
  /* grid-template-columns: 1fr 1fr;   */
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
  gap: 60px 40px;
`;

const StyledLoginMessageWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px); /* for Safari */
  z-index: 50;
  transition: all 0.1s ease-in-out;
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledLoginMessage = styled.div`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-radius: 10px;
    padding: 20px;
    max-width: 250px;
    z-index: 51;
`;

const LoginButtons = styled.div`
  display: flex;
  gap: 20px;
`

export default function ProductsGrid({ products, wishedProducts = [] }) {
  const { loginMessage } = useContext(CartContext);

  const login = async () => {
    await signIn('google');
}

  return (
    <>
      {loginMessage && (
        <StyledLoginMessageWrapper>
          <StyledLoginMessage>
            <Title>You need to Login to add product to wishlist </Title>
            <LoginButtons>
            <Button
                onClick={login}
                primary size='l'>Login</Button>
                <Button  size='l'>Cancel</Button>
                </LoginButtons>
          </StyledLoginMessage>
        </StyledLoginMessageWrapper>
      )}
      <StyledProductsGrid>
        {products?.length > 0 && products.map((product, index) => (
          <RevealWrapper key={product._id} delay={index * 50}>
            <ProductBox {...product}
              wished={wishedProducts.includes(product._id)} />
          </RevealWrapper>
        ))}
      </StyledProductsGrid>
    </>
  );
}