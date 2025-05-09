"use client"
import { usePathname, useSearchParams,useRouter } from 'next/navigation'
import React from 'react'

export default function Filter() {

  const pathname = usePathname(); //to get the url
  const searchParams = useSearchParams();
  const {replace}= useRouter(); //to replace our url after changing it

  const handleFilterChange =(e:React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)=>{
    // we will take the names and values using the event target
    const {name, value} = e.target;
    // console.log(name,value);
    const params = new URLSearchParams(searchParams);
    //set new params
    params.set(name,value);
    // then replace our url
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='mt-12 flex justify-between'>
      {/* Left Side */}
      <div className='flex gap-6 flex-wrap'>
        <select name='type' id="" className='py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]' onChange={handleFilterChange}>
            <option>Type</option>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
        </select>
        <input type="text" name="min" placeholder='min price' className='text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400' onChange={handleFilterChange}/>
        <input type="text" name="max" placeholder='max price' className='text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400' onChange={handleFilterChange}/>
        {/* <select name='type' id="" className='py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]'>
            <option>sizes</option>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
        </select>
        <select name='type' id="" className='py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]'>
            <option>Color</option>
            <option value="">test</option>
        </select> */}
        <select name='cat' id="" className='py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]' onChange={handleFilterChange}>
            <option>Category</option>
            <option value="">New Arrival</option>
            <option value="">Popular</option>
        </select>
        <select name='type' id="" className='py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]' onChange={handleFilterChange}>
            <option>All Filters</option>
        </select>
      </div>

      {/* Right Side */}
      <div className=''>
        <select name='sort' id="" className='py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400' onChange={handleFilterChange}>
                <option>Sort By</option>
                <option value="asc price">Price (low to high)</option>
                <option value="desc price">Price (high to low)</option>
                <option value="asc lastUpdated">Newest</option>
                <option value="desc lastUpdated">Oldest</option>
            </select>
      </div>
    </div>
  )
}
