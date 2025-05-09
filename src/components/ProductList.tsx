import { wixClientServer } from '@/lib/wixClientServer';
import Image from 'next/image'
import Link from 'next/link'
// import DOMPurify from "isomorphic-dompurify"
import React from 'react'
import { products } from '@wix/stores';
import  DOMPurify  from 'isomorphic-dompurify';
import Pagination from './Pagination';

const PRODUCT_PER_PAGE = 8;

export default async function   ProductList ({categoryId,limit,searchParams}:{categoryId:string; limit?:number;searchParams?:any}) {

  const wixClient = await wixClientServer();
  // updated the response and added starts with in case we are using search bar 
  // we added has some and this can be physical or digital as we can give any specific items and if not exist give me type set to physical or digital
  //for less than and greater than we will use gt and lt
  // const res = await wixClient.products.queryProducts().eq("collectionIds",categoryId).limit(limit || PRODUCT_PER_PAGE).find(); //if there is no limit show me 20 products
  //if there is no limit show me 20 products
  // skip is for pagination, skip old items and start from the new items
  // page that is written in the url is string so change it to int and multiple it by the limit and we are on the first page show 0 and skip nothing
  let  productQuery =  wixClient.products.queryProducts().startsWith("name",searchParams?.name || "").eq("collectionIds",categoryId).hasSome("productType", [searchParams?.type || "physical", "digital"]).gt("priceData.price", searchParams?.min || 0).lt("priceData.price", searchParams?.max || 99999).limit(limit || PRODUCT_PER_PAGE).skip(
    searchParams?.page
      ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
      : 0
  );

  // console.log(searchParams.sort); //asc lastUpdated
  if(searchParams?.sort)
  {
    const [sortType,sortBy] = searchParams?.sort.split(" ");

    if(sortType === "asc"){
     productQuery = productQuery.ascending(sortBy);
    }
    
    if(sortType === "desc"){
      productQuery = productQuery.descending(sortBy)
    }
  }
  

  // we can filter our response through function or condition then the find method sends us the promise
  const res = await productQuery.find();
  // console.log(res);

  return (
    <div className='mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap'>
      {/* products comes from wix store */}
      {res.items.map((product:products.Product)=>(      
        <Link href={"/"+product.slug} className='w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]' key={product._id}>
          {/* Image */}
          <div className='relative w-full h-80 '>
              <Image  
                src={product.media?.mainMedia?.image?.url || "/product.png"} 
                alt="" 
                fill 
                sizes='25vw'
                className='absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500'
              />
              {
                product.media?.items && 
                (<Image 
                  src={product.media?.items[1]?.image?.url || "/product.png"} 
                  alt="" 
                  fill 
                  sizes='25vw' 
                  className='absolute object-cover rounded-md'
                />)
              }  {/* if the second image exists then choose the second image items[1] */} 
          </div>

          {/* Title Text */}
          <div className='flex justify-between'>
              <span className='font-medium'>{product.name}</span>
              <span className='font-semibold'>$ {product.price?.price}</span>   {/* This is an object */}
          </div>
          {/* Description Text */}
          {/* When we add any description from WIX we can change its style and make it italic and bold so it will appear in the website as <p> text </p> */}
          {/* To solve this issue we will dangerously inner html this is dangerous as someone may add something dangerous*/}
          {/* To prevent anyone of addind something dangerous we will install this package*/}
          {/* npm i isomorphic-dompurify*/}
          {/*This library will allow use to only add safe items as bold tag or p tag  */}
          {
            product.additionalInfoSections && 
            (<div className='text-sm text-gray-500' dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(product.additionalInfoSections.find((section:any)=>section.title ==="shortDesc")?.description || ""),}}>
              {/* {product.additionalInfoSections?.find((section:any)=>section.title ==="shortDesc")?.description || ""}  write the description after checking that its short description only  */}
            </div>
          )}
          {/* Button */} 
          <button className='w-max rounded-2xl ring-1 ring-myred py-2 px-4 text-myred text-xs hover:bg-myred hover:text-white'>Add To Cart</button> {/* w-max to not to take full width */} 
        </Link>
      ))}
      {/* <Pagination currentPage={res.currentPage || 0} hasPrev={res.hasPrev()} hasNext={res.hasNext()}/> */}
      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={res.currentPage || 0}
          hasPrev={res.hasPrev()}
          hasNext={res.hasNext()}
        />
      ) : null}
    </div>
  )
}
