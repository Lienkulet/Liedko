import { ProductsGrid, Spinner } from "@/components";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Categories";
import { Product } from "@/models/Product";
import axios from "axios";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { authOptions } from "../api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";



export default function CategoryPage({category, subCategories,products:originalProducts, wishedProducts}) {

    const CategoryHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

`;

const FiltersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
`;

const Filter = styled.div`
    background-color: #ddd;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    gap: 5px;
    color: #444;

    select{
        background-color: transparent;
        border: 0;
        font-size: inherit;
        color: #444;
    }
`;

    const defaultSorting = '_id-dessc';
    const defaultFilterValues = category.properties
    .map(p => ({ name: p.name, value: 'all' }));
    
    const [products, setProducts] = useState(originalProducts);
    const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
    const [sort, setSort] = useState(defaultSorting);
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (filterName, filterValue) => {
        setFiltersValues(prev => {
            return prev.map(p => ({
                name: p.name,
                value: p.name === filterName ? filterValue : p.value,
            }));

        })
    }

    useEffect(() => {
        if(filtersValues !== defaultFilterValues 
            && sort !== defaultSorting){
                setLoading(true);
            }
        const catIds = [category._id, ...(subCategories?.map(c => c._id)) || []];
        const params = new URLSearchParams;
        
        params.set('categories', catIds.join(','))
        params.set('sort', sort);

        filtersValues.forEach(f => {
            if(f.value !== 'all'){
                params.set(f.name, f.value);
            }
        });
        
        const url = `/api/products?` + params.toString();

        axios.get(url).then(response => {
            setProducts(response.data);
            setLoading(false);
        })


    }, [filtersValues, sort]);

    return (
        <>
        <CategoryHeader>   
        <Title>{category.name}</Title>
        <FiltersWrapper>

        {category.properties?.map(prop => (
            <Filter key={prop.name}>
                <span>
                {prop?.name}
                </span>
                <select 
                onChange={e => handleFilterChange(prop.name, e.target.value)}
                value={filtersValues.find(f => f.name === prop?.name).value}>
                    <option value='all'>All</option>
                    {prop.values.map(val => (
                        <option key={val} value={val}>{val}</option>
                        ))}
                </select>
            </Filter>
        ))}
        <Filter>
            <span>Sort</span>
            <select
                value={sort} 
                onChange={e => setSort(e.target.value)}>
                <option value={'price-asc'}>Price Lowest first</option>
                <option value={'price-desc'}>Price Highest first</option>
                <option value={'_id-desc'}>Newest first</option>
                <option value={'_id-asc'}>Oldest first</option>
            </select>
        </Filter>
        </FiltersWrapper>
        </CategoryHeader>   
        {loading && <Spinner fullWidth />} 
        { !loading && (
            <div>
                {products.length > 0 && (
                    <>
                    <p>{products.length} Products Found</p> 
                    <ProductsGrid products={products} wishedProducts={wishedProducts} /> 
                    </>
                )}
                {products.length === 0 && (
                    <div>0 Products Found</div> 
                )}
            </div>
            ) 
        }
        </>
    )
}

export async function getServerSideProps(context){
    await mongooseConnect();

    const category = await Category.findById(context.query.id);
    const subCategories = await Category.find({parent:category._id});
    
    const catIds = [category._id, ...subCategories?.map(c => c._id)];
    const products = await Product.find({category: catIds});

    const session = await getServerSession(context.req, context.res, authOptions);

    const wishedProducts = session?.user
     ? await WishedProduct.find({
        userEmail: session.user.email,
        product: products.map(p => p._id.toString()),
    }) : [];

    return{
        props: {
            category: JSON.parse(JSON.stringify(category)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString())
        }
    }

}