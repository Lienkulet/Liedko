import { Button, ButtonLink, Input, Order, ProductBox, Spinner } from "@/components";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import styled, { css } from "styled-components";

const Box = styled.div`

  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr;

    gap: 40px;
    margin-top: 30px;
    
    div:nth-child(1){
        order: 2;
    }

    @media screen and (min-width: 800px) {
        grid-template-columns: 1.2fr .8fr;
        
        div:nth-child(1){
        order: 0;
        }
    }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 50px 40px;
    padding: 5px;
`;

const TitleButton = styled.button`
    background-color: transparent;
    padding: 10px;
    border: 0;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;

    ${props => props.active && css`
        border-bottom: 2px solid black;
        padding-bottom: 8px;
    `}
`;

const TitleButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

`;

const OrdersWrapper = styled.div`   

`;

export default function AccountPage() {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCiy] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [wishLoaded, setWishLoaded] = useState(false);
    const [wishedItems, setWishedItems] = useState([]);
    const [ordersActive, setOrdersActive] = useState(false);
    const [ordersLoaded, setOrdersLoaded] = useState(false);
    const [ordersProducts, setOrdersProducts] = useState([]);

    useEffect(() => {
        if (session) {
            setLoaded(true);
            setWishLoaded(true);
            setOrdersLoaded(true);
            axios.get('/api/address').then(response => {
                setName(response.data?.name)
                setEmail(response.data?.email);
                setCiy(response.data?.city);
                setCountry(response.data?.country);
                setPostalCode(response.data?.postalCode);
                setStreetAddress(response.data?.streetAddress);
                setLoaded(false);
            });

            axios.get('/api/wishlist').then(response => {
                setWishedItems(response.data.map(p => p.product));
                setWishLoaded(false);
            });

            axios.get('/api/orders').then(response => {
                setOrdersProducts(response.data);
                setOrdersLoaded(false);
            })
        } else {
            return;
        }
    }, [session]);

    const logout = async () => {
        await signOut({
            callbackUrl: 'http://localhost:4000'
        });
    }

    const login = async () => {
        await signIn('google');
    }

    const saveAddress = async () => {
        const data = { name, email, city, streetAddress, postalCode, country }
        await axios.put('/api/address', data);
        toast.success('Details saved successfully!');
    }

    const productRemoved = (removeId) => {
        setWishedItems(p => {
            return [...p.filter(pp => pp._id !== removeId)];
        });
    }

    return (
        <>
            <ColsWrapper>
                <div>
                    <RevealWrapper>
                        <Box>
                            {session? (
                                <>
                            
                                <TitleButtons>
                                <TitleButton 
                                    active={ordersActive? false : true}
                                    onClick={() => setOrdersActive(false)}>WishList</TitleButton>
                                <TitleButton 
                                    active={ordersActive? true : false}
                                    onClick={() => setOrdersActive(true)} >Orders</TitleButton>
                            </TitleButtons>
                            {!ordersActive?  (
                                <>
                            {wishLoaded && (
                                <Spinner fullWidth={true} />
                                )}

                            {!wishLoaded && (
                                <WishedWrapper>
                                    {wishedItems.length > 0 && wishedItems.map(p => (
                                        <ProductBox key={p._id} {...p} wished={true} onRemoveFromWishList={productRemoved} />
                                        ))}
                                </WishedWrapper>
                            )}

                            {!wishLoaded && wishedItems.length <= 0 && (
                                <>
                                    <h2>Your Wish List Is Empty</h2>
                                    <ButtonLink href={'/products'}>Shop for products</ButtonLink>
                                </>
                            )}
                            </>
                            )
                            :
                            <>
                            {ordersLoaded && (
                                <Spinner fullWidth={true} />
                            )}
                            {!ordersLoaded && (
                                <OrdersWrapper>
                                    {ordersProducts.length > 0 && ordersProducts.map(p => (
                                            <Order key={p._id} {...p} />
                                        ))}
                                </OrdersWrapper>
                            )}
                            </>
                            }
                                </>
                            )
                            
                            :
                            (
                                <>Log In To See Your Orders Ad Wish List</>
                            )
                            }
                            
                            
                        </Box>
                    </RevealWrapper>
                </div>
                <div>
                    <RevealWrapper delay={200}>

                        <Box>
                            <h2>Account Details</h2>
                            {loaded && (
                                <Spinner fullWidth={true} />
                            )}
                            {!loaded && (
                                <>
                                    <Input type='text'
                                        value={name}
                                        name='name'
                                        onChange={e => setName(e.target.value)}
                                        placeholder='Name'
                                    />
                                    <Input type='text'
                                        value={email}
                                        name='email'
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder='Email'
                                    />
                                    <CityHolder>
                                        <Input type='text'
                                            value={city}
                                            name='city'
                                            onChange={e => setCiy(e.target.value)}
                                            placeholder='City'
                                        />
                                        <Input type='text'
                                            value={postalCode}
                                            name='postalCode'
                                            onChange={e => setPostalCode(e.target.value)}
                                            placeholder='Postal Code'
                                        />
                                    </CityHolder>
                                    <Input type='text'
                                        value={streetAddress}
                                        name='streetAddress'
                                        onChange={e => setStreetAddress(e.target.value)}
                                        placeholder='Street Address'
                                    />
                                    <Input type='text'
                                        value={country}
                                        name='country'
                                        onChange={e => setCountry(e.target.value)}
                                        placeholder='Country' />
                                    <Button
                                        primary black size='l'
                                        onClick={saveAddress}>
                                        Save
                                    </Button>
                                </>
                            )}
                            <hr />
                            {session && (
                                <Button
                                    onClick={logout}
                                    primary >Logout</Button>
                            )}
                        </Box>
                    </RevealWrapper>
                </div>
            </ColsWrapper>


            {!session && (
                <Button
                    onClick={login}
                    primary size='l'>Login</Button>
            )}
        </>
    )
}