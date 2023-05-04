import { ButtonLink } from '@/components';
import { CartContext } from '@/context/StateContext';
import React, { useContext, useEffect } from 'react'
import styled from 'styled-components';

import {BsFillBagCheckFill} from 'react-icons/bs';

const Success = () => {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
  }, []);


  const StyledSuccess = styled.div`
    background-color: #dcdcdc;
    padding: 50px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media screen and (min-width: 800px) {
      width: 1000px;
      margin: 160px auto auto;
    }
  `

  const SuccessTitle = styled.h1`
    color: #324d67;
    font-weight: 950;
    text-align: center;
    margin-bottom: 10px;

    @media screen and (min-width: 800px) {
      font-size: 3rem;
    }
  `

  const SuccessIcon = styled.div`
    align-items: center;
  `

  const SuccessSubTitle = styled.p`
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    margin-top: 0;
  `

  const SuccessHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
  `


  return (
    <>
        <StyledSuccess>
          <SuccessIcon>
            <BsFillBagCheckFill size={'3rem'} color='green'/>
          </SuccessIcon>
          <SuccessHeader>
            <SuccessTitle>Thank You For Your Order!</SuccessTitle>
            <SuccessSubTitle>Check your email inbox for the receipt</SuccessSubTitle>
          </SuccessHeader>
            <ButtonLink href={'/'} primary="true" size='l'>CONTINUE SHOPPING</ButtonLink>
        </StyledSuccess>
    </>
  )
}

export default Success