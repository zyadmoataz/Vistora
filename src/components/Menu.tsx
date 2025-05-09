"use client";
// This is a client component as this have an interaction 

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function Menu() {

    const [open, setOpen] = useState(false);

  return (
    <div>
        <Image width={30} height={30} src="/menu.png" alt="menu" className='cursor-pointer' onClick={() => setOpen(prev=> !prev)} />
        {open && 
            // top is 20 as my nav bar is 20 so it will start from there
            <div className='absolute bg-black text-white top-20 left-0 w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center gap-8 text-xl z-10'>
                <Link href='/'>Home</Link>
                <Link href='/about'>Shop</Link>
                <Link href='/about'>Deals</Link>
                <Link href='/about'>About</Link>
                <Link href='/about'>Contact</Link>
                <Link href='/about'>Logout</Link>
                <Link href='/about'>Cart (1)</Link>
            </div>
        }
    </div>
  )
}
