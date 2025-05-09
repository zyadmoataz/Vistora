// Nav Bar is a server component 
import Link from 'next/link'
import React from 'react'
import Menu from './Menu'
import Image from 'next/image'
import SearchBar from './SearchBar'
import dynamic from 'next/dynamic'
// import NavIcons from './NavIcons'
// dynamic import
const NavIcons = dynamic(() => import("./NavIcons"), {ssr:false})  

export default function NavBar() {
  return (
    <div className='h-[100px] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative'>
        {/* MOBILE */}
        <div className='flex justify-between items-center h-full md:hidden'>
            <Link href='/'> 
                <div className='text-2xl tracking-widest cursor-pointer'>
                    ZYAD
                </div>
            </Link>
            {/* we created a separate menu comonenet as this will be client component */}
            <Menu />
        </div>

        {/* BIGGER SCREENS */}
        <div className='hidden md:flex justify-between items-center h-full gap-8'>
            {/* LEFT SECTION */}
            <div className='w-1/3 xl:w-1/2 flex items-center gap-12'>
                <Link href='/' className='flex items-center gap-3'> 
                    <div className='text-2xl tracking-widest cursor-pointer'>
                        <Image width={180} height={180} src='/logo2.png' alt='logo' />
                    </div>
                </Link>
                <div className='hidden xl:flex gap-4'>
                    <Link href='/'>Homepage</Link>
                    <Link href='/'>Shop</Link>
                    <Link href='/'>Deals</Link>
                    <Link href='/'>About</Link>
                    <Link href='/'>Contact</Link>
                </div>
            </div>
            {/* RIGHT SECTION */}
            <div className='w-2/3 xl:w-1/2 flex items-center justify-between gap-8'>
                <SearchBar />
                <NavIcons />
            </div>
        </div>
    </div>
  )
}
