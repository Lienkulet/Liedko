import React from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box; 
    font-size: inherit;       
` 

const Input = (props) => {
  return <StyledInput {...props} />
}

export default Input