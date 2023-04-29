import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Button, HeartOutline, HeartSolid } from '.';
import { CartContext } from '@/context/StateContext';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ProductWrapper = styled.div`
   max-width: 250px;
   height: 440px;
    :hover{
        transform: scale(1.1);
        transition: transform .5s ease;
    }
`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    text-decoration: none;
    position: relative;

    img{
        width: 250px;
        height: 250px;
    }
`;

const Title = styled(Link)`
    display: flex;
    width: 100%;
    min-height: 90px;
    /* overflow: hidden; */
    font-size: 1.1rem;
    font-weight: bold;
    text-decoration: none;
    color: #000;
`;

const ProductInfoBox = styled.div`
    margin-top: 10px;
`
const PriceRow = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-direction: column;
    gap: 10px;
    /* margin-top: 15px; */
`

const Price = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

const HeartButton = styled.button`
    border: 0;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    cursor: pointer;

    svg{
        width: 16px;   
    }

    ${props => props.wished ? `
        color: red;
    ` 
    : `
        color: black
    `}
` 


const ProductBox = ({ _id, title, description, 
        price, images, wished,
        onRemoveFromWishList=()=>{},
    }) => {
    const { addProduct, setLoginMessage } = useContext(CartContext);
    const [isWished, setIsWished] = useState(wished);
    const { data: session } = useSession();
    const url = '/product/' + _id;

    const addToWishList = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(session){
        const nextVal = !isWished;
        if(nextVal === false && onRemoveFromWishList){
            onRemoveFromWishList(_id);
        } 
            axios.post('/api/wishlist', {
                product: _id,
            }).then(() => {});
        // }
        setIsWished(nextVal);
    } else { 
        setLoginMessage(true);
    }
}

    return (
        <>
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <HeartButton 
                    wished={isWished} 
                    onClick={addToWishList}>
                    {isWished ? <HeartSolid /> : <HeartOutline /> }
                    </HeartButton>
                    <img src={images?.[0]} alt="" />
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>${price}</Price>
                    <div>
                        {/* <StyledSendImage>
                            <img src={images?.[0]} alt="" ref={imgRef} />
                        </StyledSendImage> */}
                        <Button primary outline
                            onClick={e => {
                                addProduct(_id);
                                // sendImageToCart(e);
                            }}>
                            Add to cart
                        </Button>
                    </div>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
        </>
    )
}

export default ProductBox