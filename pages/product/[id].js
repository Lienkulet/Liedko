import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import { Button, CartIcon, Center, Footer, Header, ProductImages, ProductReviews } from "@/components";
import { useContext } from "react";
import { CartContext } from "@/context/StateContext";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr; 
  gap: 40px;
  margin: 40px 0;

  @media screen and (min-width: 800px) {
    grid-template-columns: .8fr 1.2fr; 
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Price = styled.span`  
  font-size: 1.5rem;
  font-weight: 900;
`;

const Description = styled.div`
  min-height: 100px;
`

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);

  return (
    <>
      <ColWrapper>
        <Box>
          <ProductImages images={product.images} />
        </Box>
        <div>
          <Title>{product.title}</Title>
          <Description>{product.description}</Description>
          <ProductRow>
            <Price>${product.price}</Price>
            <Button primary onClick={() => addProduct(product._id)}>
              <CartIcon />
              Add to cart
            </Button>
          </ProductRow>
        </div>
      </ColWrapper>
      <ProductReviews product={product} />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  }
}