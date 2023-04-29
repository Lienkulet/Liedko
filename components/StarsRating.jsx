import React, { useState } from 'react'
import { StarOutline, StarSolid } from '.'
import styled, { css } from 'styled-components'
import { primary } from '@/lib/colors';

const StarsWrapper = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 3px;
    position: relative;
    top: 2px;
`

const StarWrapper = styled.button`
    display: inline-block;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: ${primary};
    margin-bottom: 10px;
   
    ${props => props.size === 'md' && css`
        height: 1.4rem;
        width: 1.4rem;
    `}

    ${props => props.size === 'sm' && css`
        height: 1rem;
        width: 1rem;
    `}

     ${props => !props.disabled  && css`
        cursor: pointer;
    `}
`;

const StarsRating = ({
    size='md',
    defaultClick = 0,
    disabled, onChange
}
    ) => {
    const [clicks, setClicks] = useState(defaultClick);
    const five = [1, 2, 3, 4, 5];

    const handleStarClick = (n) => {
        if(disabled){
            return;
        }
        setClicks(n);
        onChange(n);
    }

    return (
        <StarsWrapper>
            {five.map((n, index) => (
                <>
                    <StarWrapper 
                        key={index}
                        disabled={disabled}
                        size={size}
                        onClick={() => handleStarClick(n)}>
                        {clicks >= n ? <StarSolid /> : <StarOutline />}
                    </StarWrapper>
                </>
            ))}
        </StarsWrapper>
    )
}

export default StarsRating