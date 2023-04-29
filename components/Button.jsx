import { primary } from '@/lib/colors';
import React from 'react'
import styled, {css} from 'styled-components'

export const ButtonStyle = css`
     border: 0;
    padding: 5px 15px;
    border-radius: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: bold;

    svg{
        height: 16px;
        margin-right: 5px
    }
    ${props => props.size === 'l' && css`
        font-size: 1.2rem;
        padding: 10px 20px;

        svg{
            height: 20px;
        }
    `}
    
    ${props => props.primary && !props.outline && css`
        background-color: ${primary};
        border: 2px solid ${primary};
        color: #fff; 
    `}

    ${props => props.block && css`
        display: block;
        width: 100%;
    `}
    
    ${props => props.primary && props.outline && css`
    background-color: transparent;
    border: 2px solid ${primary};
    color: ${primary};
    font-size: 1rem
    `}

    ${props => props.white && !props.outline && css`
    background-color: #fff;
    color: #000;
    `}
    
    ${props => props.white && props.outline && css`
    background-color: transparent;
    color: white;
    border: 2px solid white;
    `}

    ${props => props.black && !props.outline && css`
    background-color: #000;
    color: #fff;
    `}
    
    ${props => props.black && props.outline && css`
    background-color: transparent;
    color: #fff;
    border: 2px solid #000;
    `}

    ${props => props.red && !props.outline && css`
    background-color: red;
    border: 2px solid red;
    color: #fff;
    `}
    
    ${props => props.red && props.outline && css`
    background-color: transparent;
    color: #fff;
    border: 2px solid red;
    `}
`;

const StyledButton = styled.button`
   ${ButtonStyle}
`;

const Button = ({ children, ...rest }) => {
    return (
        <StyledButton {...rest}>{children}</StyledButton>
    )
}

export default Button