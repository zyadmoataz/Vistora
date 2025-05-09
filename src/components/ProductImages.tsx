"use client"
import Image from 'next/image'
import React, { useState } from 'react'

// const images =[
//     {id:1,url:"https://images.pexels.com/photos/776656/pexels-photo-776656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"},
//     {id:2,url:"https://images.unsplash.com/photo-1741006727915-d25215fdaf04?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
//     {id:3,url:"https://images.unsplash.com/photo-1742626157103-76367e3798bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
//     {id:4,url:"https://images.unsplash.com/photo-1700206402761-c37ae8c0af8c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
// ];

export default function ProductImages({items}:{items:any}) {
    const [index,setIndex] =useState(0);
  return (
    <div>
      {/* Main Image */}
      <div className='h-[500px] relative'>
        <Image src={items[index].image?.url} sizes="50vw" alt="Image" fill className='object-cover rounded-md'/>  {/* Max size 50 vw */}
      </div>
      {/* Small Image */}
      <div className='flex justify-between gap-4 mt-8'>
       {items.map((item:any ,i:number)=> (
         <div className='w-1/4 h-32 relative gap-4 mt-8 cursor-pointer' key={item._id} onClick={()=>setIndex(i)}>
            <Image src={item.image?.url} sizes="30vw" alt="Image" fill className='object-cover rounded-md'/>
         </div>
       ))}
      </div>
    </div>
  )
}
