import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Input, Spinner, StarsRating, Textarea } from '.'
import axios from 'axios'

const Title = styled.h2`
    font-size: 1.2rem;
`

const SubTitle = styled.h3`
    font-size: 1rem;
`
const RewierColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    /* margin-bottom: 40px; */
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
`

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;

  :nth-child(1){
    height: fit-content;
  }
`;

const ReviewWrapper = styled.div`
    margin-bottom: 10px;
    border-top: 1px solid #ddd;
    padding: 10px 0;

    h3{
        margin: 0;
        padding: 0;
        font-size: 1.1rem;
        font-weight: bold;
    }

    p{
        margin: 0;
        padding: 5px 0;
        width: fit-content;
        font-size: 1rem;
    }
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;

    time{
        font-size: 1rem;
        font-weight: bold;
        color: #aaa;
    }
`;

const ProductReviews = ({ product }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stars, setStars] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const submitReview = async () => {
        const data = {title, description, stars, product: product._id}
        await axios.post('/api/reviews', data).then(res => {
            setTitle('');
            setDescription('');
            setStars(0);
        });

        loadReviews();
    }

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        setLoading(true);
        axios.get('/api/reviews?product=' + product._id).then(res => {
            setReviews(res.data);
            setLoading(false);
        });
    }

   
    return (
        <div>
            <Title>Reviews</Title>
            <RewierColsWrapper>
                <Box>
                    <SubTitle>Add Review</SubTitle>
                    <div>
                        <StarsRating onChange={setStars} />
                    </div>
                    <Input 
                        placeholder='Title'
                        value={title} 
                        onChange={e => setTitle(e.target.value) } />
                    <Textarea 
                        placeholder='Your thoughts about this product'
                        value={description} onChange={e => setDescription(e.target.value)} />
                    <div>
                        <Button primary size='l' onClick={submitReview}>Submit review</Button>
                    </div>
                </Box>
                <Box>
                    <SubTitle>All Review</SubTitle>
                    {loading && (
                        <Spinner fullWidth={true} />
                    )}
                    {reviews.length <= 0 && (
                        <p>No reviews : ( </p>
                    )}
                    {reviews.length > 0 && reviews.map(review => (
                        <ReviewWrapper key={review._id}>
                            <ReviewHeader>
                                <StarsRating size={'sm'} disabled={true} defaultClick={review.stars} />
                                <time>{(new Date(review.createdAt)).toLocaleString()}</time>
                            </ReviewHeader>
                            <h3>{review.title}</h3>
                            <p>{review.description}</p>
                        </ReviewWrapper>
                    ))}
                </Box>
            </RewierColsWrapper>
        </div>
    )
}

export default ProductReviews