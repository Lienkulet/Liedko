import React from 'react'
import styled from 'styled-components'

const StyledOrder = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #ddd;

    h3{
        margin: 5px 0;
    }
`;

const OrderHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    gap: 10px;
    font-size: 1rem;
    font-weight: bold;
`;

const OrderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;
`;

const Order = ({line_items, total, createdAt, quantity}) => {
  return (
    <StyledOrder>
        <OrderHeader>
            <h3>Date: {(new Date(createdAt)).toLocaleString()}</h3>
            <h3>Total: ${total}</h3>
        </OrderHeader>
        <h3>Products:</h3>
        {line_items.map(p => (
            <OrderRow key={p._id}>
                    <span>{p.quantity} x {p.price_data.product_data.name}</span>  
                    <span>${p.price_data.unit_amount / 100}</span>
            </OrderRow>
    ))}
    </StyledOrder>
  )
}

export default Order