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
  // Start building the query
  let productQuery = wixClient.products.queryProducts();
  
  // Add name filter if provided
  if (searchParams?.name) {
    productQuery = productQuery.startsWith("name", searchParams.name);
  }
  
  // Add category filter only if categoryId is not empty
  if (categoryId && categoryId.trim() !== "") {
    productQuery = productQuery.eq("collectionIds", categoryId);
  }
  
  // Add product type filter
  productQuery = productQuery.hasSome("productType", [searchParams?.type || "physical", "digital"]);
  
  // Add price range filters
  productQuery = productQuery.gt("priceData.price", searchParams?.min || 0)
                           .lt("priceData.price", searchParams?.max || 99999);
  
  // Note: We'll handle sale filtering after fetching the products
  // since direct 'onSale' and 'tags' filtering might not be supported in the API
  
  // Apply pagination
  productQuery = productQuery.limit(limit || PRODUCT_PER_PAGE)
                           .skip(searchParams?.page
                             ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
                             : 0);

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
  

  // Fetch products from Wix
  let res = await productQuery.find();
  
  // Post-fetch filtering for sale items
  if (searchParams?.onSale === "true" || searchParams?.onSale === true) {
    // Filter items that have a different price (sale price) than the original price
    res = {
      ...res,
      items: res.items.filter(item => 
        item.priceData && 
        item.priceData.discountedPrice !== item.priceData.price
      )
    };
  }
  
  // Filter by sale type using custom field or description if specified
  if (searchParams?.tag) {
    const tag = searchParams.tag.toLowerCase();
    res = {
      ...res,
      items: res.items.filter(item => {
        // Try to match against description or custom fields
        const description = item.description?.toLowerCase() || '';
        const name = item.name?.toLowerCase() || '';
        
        // For the purpose of demo, we'll look for keywords in the name or description
        // In a real app, you might use a custom field on the products
        return (
          (tag === 'flash' && (description.includes('flash') || name.includes('flash'))) ||
          (tag === 'clearance' && (description.includes('clearance') || name.includes('clearance'))) ||
          (tag === 'bundle' && (description.includes('bundle') || name.includes('bundle')))
        );
      })
    };
  }
  
  // console.log(res);

  // Check if there are more products available
  const hasMoreProducts = res.items.length === (limit || PRODUCT_PER_PAGE);
  
  // Create a hidden element with data attribute to access from pagination component
  const paginationData = JSON.stringify({
    hasMore: hasMoreProducts,
    totalItems: res.items.length
  });
  
  return (
    <div className='mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap'>
      {/* Hidden element to store pagination data */}
      <div 
        id="pagination-data" 
        data-has-more={hasMoreProducts.toString()} 
        data-total-items={res.items.length}
        style={{ display: 'none' }}
      />
      
      {/* No products message */}
      {res.items.length === 0 && (
        <div className="w-full text-center py-12">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}
      
      {/* Products grid */}
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
