import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Settings } from "@/models/Settings";

export default function HomePage({featuredProduct,newProducts, wishedProducts}) {
  return (
    <div>
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts={wishedProducts} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const name = 'featuredProductId';
  const featuredProductId = await Settings.findOne({name});
  const featuredProduct = await Product.findById(featuredProductId.value);
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

   
    const wishedNewProducts = session?.user
      ? await WishedProduct.find({
      userEmail: session.user.email,
      product: newProducts.map(p => p._id.toString()),
    }) : [];
  
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedProducts: wishedNewProducts.map(i => i.product.toString()), 
    },
  };
}