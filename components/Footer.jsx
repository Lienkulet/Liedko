import React from 'react'
import Center from './Center'
import styled from 'styled-components'

const StyledFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    width: 100%;

    color: #324d67;
    text-align: center;
    font-weight: 700;
    margin-top: 100px;
    padding: 10px 0;
`

const Footer = () => {
  return (
    <StyledFooter>
        <Center>
         <p>2023 Liedko ALL rights reserved</p>
        </Center>
    </StyledFooter>
  )
}

export default Footer