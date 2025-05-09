import { wixClientServer } from '@/lib/wixClientServer';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function CategoryList() {
      const wixClient = await wixClientServer();
      const res = await wixClient.collections.queryCollections().find(); //if there is no limit show me 20 products

  return (
    // To remove the scroll bar we have to make custom class as we cannot remove it by tailwind css
    <div className='px-4 overflow-x-scroll scrollbar-hide'>
      <div className='flex gap-4 md:gap-8'>
       {
        res.items.map(item=>(       
        <Link href={`/list?cat=${item.slug}`} className='flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6' key={item._id}>
            {/* if there is no image it will show that color and it should be relative as we made the image fill */}
            <div className='relative bg-slate-50 w-full h-96'>
                <Image src={item.media?.mainMedia?.image?.url || '/cat.png'} alt='' fill sizes='20vw' className='object-fill'/>
            </div>
            <h1 className='mt-8 font-light text-xl tracking-wide'>{item.name}</h1>
        </Link>
         ))}
      </div>
    </div>
  )
}
