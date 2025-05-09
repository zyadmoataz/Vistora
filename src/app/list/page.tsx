import Filter from '@/components/Filter'
import ProductList from '@/components/ProductList'
import { wixClientServer } from '@/lib/wixClientServer';
import Image from 'next/image'
import React, { Suspense } from 'react'

export default async function ListPage({searchParams}:{searchParams:any}) {
  
  const wixClient = await wixClientServer();
  const res = await wixClient.collections.getCollectionBySlug(searchParams.cat || "all-products");

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative'>
      {/* Campign */}
      <div className='hidden bg-pink-50 px-4 sm:flex justify-between h-64'>
        {/* Text Container */}
        <div className='w-2/3 flex flex-col items-center justify-center gap-8'>
          <h1 className='text-4xl font-semibold leading-[48px] text-gray-700'>Grab up to 50% off on <br/> Selected Products</h1>
          <button className='rounded-3xl bg-myred text-white w-max py-3 px-5 text-sm'>Buy Now</button>
        </div>
        {/* Imaage Container */}
        <div className='relative w-1/3'>
          <Image src="/woman.png" alt="woman" className="object-contain" fill/>
        </div>
      </div>

      {/* Filter */}
      <Filter/>

      {/* Product  List*/}
      <h1 className='mt-12 text-xl font-semibold'>{res?.collection?.name} For You!</h1>
      <Suspense fallback={"loading..."}>
        <ProductList categoryId={res.collection?._id ||  "00000000-000000-000000-000000000001"} searchParams={searchParams}/>
      </Suspense>
    </div>
  )
}
