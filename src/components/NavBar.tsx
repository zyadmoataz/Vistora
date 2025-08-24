"use client"

// Converting to client component to use usePathname hook
import Link from 'next/link'
import React from 'react'
import Menu from './Menu'
import Image from 'next/image'
import SearchBar from './SearchBar'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
// import NavIcons from './NavIcons'
// dynamic import
const NavIcons = dynamic(() => import("./NavIcons"), {ssr:false})  

export default function NavBar() {
  // Get current path for active link styling
  const pathname = usePathname();
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  // CSS classes for active and inactive links
  const activeLinkClass = 'font-semibold text-black';
  const linkClass = 'text-gray-600 hover:text-black transition-colors duration-200';
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
                <div className='hidden xl:flex gap-6'>
                    <Link href='/' className={isActive('/') && pathname === '/' ? activeLinkClass : linkClass}>Homepage</Link>
                    <Link href='/shop' className={isActive('/shop') ? activeLinkClass : linkClass}>Shop</Link>
                    <Link href='/deals' className={isActive('/deals') ? activeLinkClass : linkClass}>Deals</Link>
                    <Link href='/about' className={isActive('/about') ? activeLinkClass : linkClass}>About</Link>
                    <Link href='/contact' className={isActive('/contact') ? activeLinkClass : linkClass}>Contact</Link>
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
