"use client"
import { products } from '@wix/stores';
import React, { useEffect, useState } from 'react'
import Add from './Add';

export default function CustomizeProducts({productId,variants,productOptions}:
  {productId:string; 
    variants:products.Variant[]; 
    productOptions:products.ProductOption[];
  }) {

    // store color and size in use state hook and its type is object 
    const [selectOptions,setSelectOptions]=useState<{[key:string]:string}> ({});

    // Another state for clicking on items in the store
    const [selectedVariant, setSelectedVariant] =useState <products.Variant> ();

    // use effect as when we select any color and size of an item > the number of the selceted variants should change
    useEffect(()=>{
      // find the selected option of the variants
      const variant = variants.find(v=>{
        const variantChoices =v.choices;
        if(!variantChoices) return false

        // check our combination of size and color and for each item we will check the key and the value
        return Object.entries(selectOptions).every(([key,value])=> variantChoices[key]===value)
      });
      setSelectedVariant(variant)
    },[selectOptions,variants])


    // inside selectOptions it will be object {of color: .. and size:.. } and upon this combination we will check if its available or not
    const handleOptionSelect  =(optionType:string,choice:string)=>{
      setSelectOptions((prev)=>({...prev,[optionType]:choice}))
    }
    // console.log(variants);   array has object of choices that has color:white and size:small for example and we have another stock object and inside it in stock is true
    
    //takes choices as input - this is an object like {color: "red", size: "L"} 
    const isVariantInStock = (choices:{[key:string]:string})=>{
      //It returns true if ANY variant matches both conditions (that's what .some() does) If no variants match, it returns false
      return variants.some((variant)=>{
        const variantChoices =variant.choices;
        
        if(!variantChoices ) return false;
        //First Check (Left Side) 
        // This checks if all the customer's selections (like color/size) exactly match the variant's options.
        //Example: If you chose {color: "red", size: "L"}, it verifies the variant has both color: "red" AND size: "L".
        //Second Check (Right Side)
        //his safely checks if the variant has stock available (the ?. means "don't crash if stock is missing"). Example: Is inStock: true for this variant?
        //The line returns true only if: The variant matches all the customer's choices AND The variant is in stock.
        return Object.entries(choices).every(([key,value])=>variantChoices[key]===value) && variant.stock?.inStock && (variant.stock?.quantity  && variant.stock?.quantity >0)
      });
    }

    console.log(selectOptions);
    return (
      <div className='flex flex-col gap-6'>
    {
      productOptions.map((option=>(
        <div className='flex flex-col gap-4' key={option.name}>
          <h4 className='font-medium'>Choose a {option.name}</h4>
          <ul className='flex items-center gap-3'>
            {option.choices?.map((choice)=>{
              const disabled = !isVariantInStock({...selectOptions,[option.name!]:choice.description!})
              const selected = selectOptions[option.name!] ===choice.description
              const clickHandler =disabled?undefined: ()=> handleOptionSelect(option.name!,choice.description!);
              return option.name ==="Color"? (
                    <li className='w-8 h-8 rounded-full ring-1 ring-gray-300 relative ' key={choice.description} style={{backgroundColor:choice.value, cursor:disabled?"not-allowed":"pointer"}} onClick={clickHandler}>
                      {
                        selected &&
                      <div className='absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'/>
                      }
                      {
                        disabled &&
                        <div className='absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'/> 
                      }
                  </li>
              ):(
                <li className='ring-1 ring-myred text-myred rounded-md py-1 px-4 text-sm' key={choice.description} style={{cursor:disabled?"not-allowed":"pointer",backgroundColor:selected? "#f35c7a":disabled? "#fbcfe8":"white",color:selected || disabled ? "white":"#f35c7a",boxShadow:disabled?"none":""}} onClick={clickHandler}>{choice.description}</li>
              )
              // Test
              // (  
              // console.log(selectOptions); if i choose purple after that on click it will be {Color: 'Purple'}
              // <div key={choice.description} onClick={clickHandler}>
              //   {choice.description} 
              //   {disabled && "disabled"} 
              //   {selected && "selected"}
              // </div>
            // )
            } )}
          </ul>
        </div>
      )))
    }
    <Add productId={productId} variantId={selectedVariant?._id || "00000000-0000-0000-0000-000000000000"} stockNumber={selectedVariant?.stock?.quantity || 0}/>
      {/* 
            // Colors
          <ul className='flex items-center gap-3'>
            <li className='w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-red-500'>
                <div className='absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'/>
            </li>
            <li className='w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-blue-500'></li>
            <li className='w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-not-allowed relative bg-green-500'>
                <div className='absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'/> 
            </li>
          </ul> */}
      {/* others */}
      {/* <h4 className='font-medium'>Choose a size</h4>
      <ul className='flex items-center gap-3'>
        <li className='ring-1 ring-myred text-myred rounded-md py-1 px-4 text-sm cursor-pointer'>Small</li>
        <li className='ring-1 ring-myred text-white bg-myred rounded-md py-1 px-4 text-sm cursor-pointer'>Medium</li>
        <li className='ring-1 ring-pink-200 text-white bg-pink-200 rounded-md py-1 px-4 text-sm cursor-not-allowed'>Large</li>
      </ul> */}
    </div>
  )
}
