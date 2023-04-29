import React from 'react'
import { Center, ProductsGrid } from '.'
import styled from 'styled-components'
import Title from './Title'

const StyledNewProducts = styled.div`

`

export default function NewProducts({products, wishedProducts}) {
    return (
      <StyledNewProducts>
      {/* <Center> */}
        <Title>New Arrivals</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts}/>
      {/* </Center> */}
      </StyledNewProducts>
    );
  }
