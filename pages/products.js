import { ProductsGrid } from '@/components'
import Title from '@/components/Title'
import { mongooseConnect } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { WishedProduct } from '@/models/WishedProduct'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'


const products = ({products, wishedProducts}) => {
  return (
    <>
        <Title>All products</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
    </>
  )
}

export default products

export async function getServerSideProps(ctx) {
    await mongooseConnect();

    const products = await Product.find({}, null, {sort:{'_id': -1}});
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    const wishedProducts = session?.user 
      ? await WishedProduct.find({
        userEmail: session.user.email,
        product: products.map(p => p._id.toString()),
      }) : [];

    return {
        props: {
            products: JSON.parse((JSON.stringify(products))),
            wishedProducts: wishedProducts.map(i => i.product.toString()), 
        }
    }
}