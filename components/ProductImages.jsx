import React, { useState } from 'react'
import styled from 'styled-components'

    const Image = styled.img`
        max-width: 100%;    
        max-height: 100%;    
    `

    const BigImage = styled.img`
        max-width: 100%;
        max-height: 200px;
    `

    const ImageButtons = styled.div`
        display: flex;
        gap: 10px;
        flex-grow: 0;
    `

    const ImageButton = styled.div`
        border: 2px solid #ccc;

        ${props => props.active ? 
        'border-color: #ccc;' 
        : 
        `border-color: transparent;`
         }

        border-radius: 12px;
        height: 60px;
        padding: 2px;
        cursor: pointer;
    `

    const BigImageWrapper = styled.div`
        text-align: center;
    `

const ProductImages = ({ images }) => {
    const [activeImg, setActiveImg] = useState(images?.[0])
    return (
        <>
        <BigImageWrapper>
            <BigImage src={activeImg} />
        </BigImageWrapper>
            <div>
                <ImageButtons>
                    {images.map(img => (
                        <ImageButton 
                        key={img}
                        active={img === activeImg}
                         onClick={() => setActiveImg(img)}>
                            <Image src={img} />
                        </ImageButton>
                    ))}
                </ImageButtons>
            </div>
        </>
    )
}

export default ProductImages