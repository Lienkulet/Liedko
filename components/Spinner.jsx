import React from 'react'
import { BounceLoader } from 'react-spinners'
import styled from 'styled-components'

const SpinnerWrapper = styled.div`
    ${props => props.fullWidth ? `
        display: flex;
        justify-content: center; 
    ` : `
    `
    }
`

const Spinner = ({fullWidth}) => {
  return (
    <SpinnerWrapper fullWidth={fullWidth}>
        <BounceLoader speedMultiplier={3} color='#555' />
    </SpinnerWrapper>
  )
}

export default Spinner