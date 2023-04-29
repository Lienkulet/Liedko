import { Input, ProductsGrid, Spinner } from "@/components";
import Title from "@/components/Title";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components"

const SearchInput = styled(Input)`
    padding: 5px 10px;
    border-radius: 5px;
    margin: 30px 0 30px;
    font-size: 1.4rem;
    position: sticky;
    top: 70px;
    z-index: 10;
`;

export default function SearchPage() {
    const [phrase, setPhrase] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useCallback(
        debounce(phrase => searchProducts(phrase), 500), [] );

    useEffect(() => {
        if(phrase.length > 0) {
            setLoading(true);
            debouncedSearch(phrase);
        }  else {
            setProducts([]);
        }
    }, [phrase])

    const searchProducts = (phrase) => {
            axios.get(`/api/products?phrase=${encodeURIComponent(phrase)}`)
                .then(response => {
                    setProducts(response.data);
                    setLoading(false);
            });
    }

    return (
        <>
            <SearchInput
                value={phrase}
                onChange={e => setPhrase(e.target.value)}
                placeholder='Search for products...'
                autoFocus />
            {products.length === 0 &&
             phrase !== '' && (
                <h2>0 Products found for "{phrase}"</h2>
            )}    
            {loading && (
                <Spinner fullWidth={true}/>
            )}
            {!loading && products.length > 0 && (
                <>
                <Title>{products.length} Products found for "{phrase}"</Title>
                <ProductsGrid products={products} />
                </>
            )}
        </>
    )
}