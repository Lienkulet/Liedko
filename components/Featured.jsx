import React, { createContext, useContext } from 'react';
import { Button, ButtonLink, CartIcon, Center } from '.';
import styled from 'styled-components';
import { CartContext } from '@/context/StateContext';
import { RevealWrapper } from 'next-reveal';

const Bg = styled.div`
  background-color: #222;
  display: flex;
  justify-content: center;
  color: #fff;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  padding: 50px 0;
  top: 0;
  
  @media screen and (min-width: 800px) {
    padding: 70px 0;
    margin-top: 30px;
    border-radius: 15px;
  }
`

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;

  @media screen and (min-width: 800px) {
    font-size: 3rem;
  }
`

const Desc = styled.p`
  color: #aaa;
  font-size: .8rem;
`

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  /* padding: 10px; */
  padding-left: 25px;
  gap: 15px;
  

  img{
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }

  div:nth-child(1){
    order: 2;
  }


  @media screen and (min-width: 800px) {
    grid-template-columns: 1.1fr 1.1fr;
    padding-left: 50px;

    & > div:nth-child(1){
      order: 0;
      justify-content: center;

    }

    img{
    max-width: 100%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 25px;
`;

const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const ImgColumn = styled(Column)`
  & > div{
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
    
`;

export default function Featured({ product }) {
  const { addProduct } = useContext(CartContext);

  return (
    <Bg>
      <ColumnsWrapper>
        <Column>
          <div>
            <RevealWrapper origin='left' delay={0}>
              <ContentWrapper>
                <Title>{product.title}</Title>
                <Desc>{product.description}</Desc>
                <ButtonsWrapper>
                  <ButtonLink href={'/product/' + product._id} outline={1} white={1}>Read more</ButtonLink>
                  <Button white onClick={() => addProduct(product._id)}>
                    <CartIcon />
                    Add to cart
                  </Button>
                </ButtonsWrapper>
              </ContentWrapper>
            </RevealWrapper>
          </div>
        </Column>
        <ImgColumn>
          <RevealWrapper origin='right' delay={0}>
            <CenterImg>
              <img
                src={product.images?.[0]} alt="" />
            </CenterImg>
          </RevealWrapper>
        </ImgColumn>
      </ColumnsWrapper>
    </Bg>
  );
}