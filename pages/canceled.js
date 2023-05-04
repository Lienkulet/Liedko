import React from 'react'
import { ButtonLink } from '@/components'
import { BsBagXFill } from 'react-icons/bs'
import styled from 'styled-components'

const Canceled = () => {
  const StyledCanceled = styled.div`
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

  const CanceledTitle = styled.h1`
    color: #324d67;
    font-weight: 950;
    margin-bottom: 10px;
    margin-bottom: 50px;

    @media screen and (min-width: 800px) {
      font-size: 3rem;
    }
  `

  return (
        <StyledCanceled>
          <BsBagXFill size={'3rem'} color='red' />
          <CanceledTitle>Your Order Has Been Canceled!</CanceledTitle>
          <ButtonLink href={'/'} primary red  size='l'>CONTINUE SHOPPING</ButtonLink>
        </StyledCanceled>
  )
}

export default Canceled