import React from 'react'
import Link from 'next/link'
import { ButtonLink, Center, Footer, Header } from '@/components'
import { BsBagXFill } from 'react-icons/bs'
import styled from 'styled-components'

const canceled = () => {
  const StyledCanceled = styled.div`
    width: 1000px;
    margin: 160px auto auto;
    background-color: #dcdcdc;
    padding: 50px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  `

  const CanceledTitle = styled.h1`
    color: #324d67;
    font-weight: 950;
    font-size: 40px;
    margin-bottom: 10px;
    margin-bottom: 50px;
  `

  return (
        <StyledCanceled>
          <BsBagXFill size={'3rem'} color='red' />
          <CanceledTitle>Your Order Has Been Canceled!</CanceledTitle>
          <ButtonLink href={'/'} primary red  size='l'>CONTINUE SHOPPING</ButtonLink>
        </StyledCanceled>
  )
}

export default canceled