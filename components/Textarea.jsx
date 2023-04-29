import React from 'react'
import styled from 'styled-components'

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 5px;
    min-height: 100px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: inherit;    
`;

const Textarea = (props) => {
  return <StyledTextarea {...props} />
}

export default Textarea