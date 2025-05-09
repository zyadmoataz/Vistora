"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function SearchBar() {

    const router =useRouter();
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        //    default behaviour is to refresh page
        e.preventDefault(); 
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string; //to get the data from the input instead of using use state hook

        if(name)
        {
          router.push(`/list?name=${name}`);
        }
    }   
  return (
    // Flex 1 to take all the remaining space
    <form className='flex bg-gray-100 justify-between items-center gap-2 px-2 py-4 rounded-md p-2 flex-1' onSubmit={handleSearch}>
        <input type="text" name="name" placeholder="Search..." className='flex-1 bg-transparent outline-none'/>
        <button type="submit" className='cursor-pointer'>
            <Image width={16} height={16} src="/search.png" alt="search" />
        </button>
    </form>
  )
}
