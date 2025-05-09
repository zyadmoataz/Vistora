import CategoryList from "@/components/CategoryList"
import ProductList from "@/components/ProductList"
import Slider from "@/components/Slider"
import { wixClientServer } from "@/lib/wixClientServer";
import { Suspense } from "react";
// import useWixClient from "@/hooks/useWixClient";
// import { useEffect } from "react";

// we can use async as this is a server component

const HomePage = async () => {

//   const wixClient =useWixClient()

// useEffect (()=>{
//   const getProducts = async ()=>{
//     const res = await wixClient.products.queryProducts().find();
//     console.log(res);
//   }

//   getProducts();
// },[wixClient])

// Fetch with server component but we will not use this as we need suspense block
// const wixClient = await wixClientServer();
// const res = await wixClient.products.queryProducts().find();
// console.log (res);    

  return (
    <div className=''>
      <Slider />
      {/* Same padding of the nav bar */}
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={"loading"}>
          <ProductList categoryId={process.env.FEATURED_PRODUCTS_CATEGORY_ID!} limit={4}/>
        </Suspense>
      </div>
      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">Categories</h1>
        <Suspense fallback={"loading"}>
          <CategoryList/>
        </Suspense>
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">New Products</h1>
        <ProductList categoryId={process.env.FEATURED_PRODUCTS_CATEGORY_ID!} limit={4}/>
      </div>
    </div>
  )
}

export default HomePage