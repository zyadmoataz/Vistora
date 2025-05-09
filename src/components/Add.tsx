'use client'
import { useCartStore } from '@/hooks/useCartStore';
import useWixClient from '@/hooks/useWixClient';
import React, { useState } from 'react'

export default function Add({productId,variantId,stockNumber}:{productId:string,variantId:string,stockNumber:number}) {
  const [quantity, setQuantity] =useState(1);

  // Temproray
// const temp=4;

const handleQuantity = (type:"inc" | "dec") => {
  if(type ==="dec" && quantity >1)
  {
    setQuantity (prev => prev-1)
  }

  if(type ==="inc" && quantity <stockNumber)
    {
      setQuantity (prev => prev+1)
    }
}

   const wixClient =useWixClient();
   const {addItem, isLoading} = useCartStore();
  
  //  we need a state mangement hook, as itsa related between the notification number the add to cart and number of items and all of this
  // so we need to install > npm i zustand instead of redux or react query
  // we added this in our middleware.ts
  // const addItem = async ()=>{
  //   const response = await wixClient.currentCart.addToCurrentCart({
  //     lineItems:[{
  //       catalogReference:{
  //         appId:process.env.NEXT_PUBLIC_WIX_APP_ID!,
  //         catalogItemId:productId,
  //         // if we have any variant
  //         ...(variantId && {options:{variantId} })
  //       },
  //       quantity:quantity
  //     }]
  //   });
  //   console.log(response)
  // }

  return (
    <div className=''>
      <h4 className='font-medium'>Choose a Quantity</h4>
      <div className='flex justify-between'>
        <div className='flex items-center gap-4'>
          <div className='bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32'>
            <button className='cursor-pointer text-xl' onClick={()=> handleQuantity("dec")}> - </button>
            {quantity}
            <button className='cursor-pointer text-xl' onClick={()=> handleQuantity("inc")}> + </button>
          </div>
          { stockNumber < 1 ? (
            <div className='text-sm'>Products is out of stock</div>
          ): 
          (
            <div className='text-sm'>
              Only <span className='text-orange-500'>
              {stockNumber} items</span> left! <br/> {"Don't"} miss it  
            </div>
          )}
        </div>

        <button className='w-36 text-sm rounded-3xl ring-1 ring-myred text-myred py-2 px-4 hover:bg-myred hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none disabled:ring-0' 
        onClick={() => addItem(wixClient, productId, variantId, quantity)} disabled={isLoading}>Add to cart</button>
      </div>
    </div>
  )
}
