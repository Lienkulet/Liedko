import { ProductBox } from "@/components"
import Title from "@/components/Title"
import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Categories";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";
import { RevealWrapper } from 'next-reveal';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const CategoryGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    /* align-items: center; */
`;

const CategoryTitle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 0;
    gap: 15px;

`;

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
    /* border-bottom: 2px solid #ccc; */
`;

const CategoryLink = styled(Link)`
    color: #555;
`;

const ShowAllSquare = styled(Link)`
    display: flex;
    background-color: #ddd;
    height: fit-content;
    width: fit-content;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #555;
    gap: 10px;
    padding: 130px 20px;

    svg{
        height: 30px;
        margin-right: 5px
    }

    :hover{
        transform: scale(1.1);
        transition: all 5s ease;
    }
    

    @media screen and (max-width: 800px) {
      display: none;
    }

`;

export default function Categories({ mainCategories, categoriesProduscts, wishedProducts}) {
    return (
        <>
                {mainCategories.map(cat => (
                    <CategoryWrapper key={cat._id}>
                        <CategoryTitle>
                            <Title>{cat.name}</Title>
                            <CategoryLink href={`/category/${cat._id}`}>Show all</CategoryLink>
                        </CategoryTitle>
                        <CategoryGrid>
                            {categoriesProduscts[cat._id].length > 0 && categoriesProduscts[cat._id].map((p, index) => (
                                <RevealWrapper key={p._id} delay={index * 50}>
                                    <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
                                </RevealWrapper>
                            ))}

                            {
                                categoriesProduscts[cat._id].length <= 0 && (
                                    <h3>No products in this category</h3>
                                )
                            }

                            { categoriesProduscts[cat._id].length > 0 && (
                                <RevealWrapper delay={categoriesProduscts[cat._id].length * 50}>
                                 <ShowAllSquare href={`/category/${cat._id}`}>
                                     Show all
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"
                                         className="w-2 h-2">
                                         <path strokeLinecap="round" strokeLinejoin="round"
                                             d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                     </svg>
                                 </ShowAllSquare>
                             </RevealWrapper>
                                )
                            }

                            
                        </CategoryGrid>
                    </CategoryWrapper>
                ))}
        </>
    )
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();

    const categories = await Category.find();
    const mainCategories = categories.filter(c => !c.parent);
    const categoriesProduscts = {}; // catId => [products]
    const allFetchedProductsId = [];

    for (const mainCat of mainCategories) {
        const mainCatId = mainCat._id.toString();

        const childCatIds = categories
            .filter(c => c?.parent?.toString() === mainCatId)
            .map(c => c._id);

        const categoriesIds = [mainCatId, ...childCatIds];

        const products = await Product.find({
            category: categoriesIds
        },
            null,
            {
                limit: 3,
                sort: { '_id': -1 }
            });

        allFetchedProductsId.push(...products.map(p => p._id.toString()));    
        categoriesProduscts[mainCat._id] = products;
    }

    const session = await getServerSession(ctx.req, ctx.res, authOptions);

        const wishedProducts = session?.user
        ? await WishedProduct.find({
            userEmail: session.user.email,
            product: allFetchedProductsId,
            })
        :
         [];

    return {
        props: {

            mainCategories: JSON.parse(
                JSON.stringify(mainCategories)
            ),
            categoriesProduscts: JSON.parse(JSON.stringify(categoriesProduscts)),
            wishedProducts: wishedProducts.map(i => i.product.toString()), 
        }
    }
}