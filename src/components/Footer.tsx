import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='py-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-gray-100 text-sm mt-24'>
      {/* Top */}
      <div className='flex flex-col md:flex-row justify-between gap-24'>
        {/* Left */}
        <div className='w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8'>
          {/* Logo */}
          <Link href="/">
             <Image width={180} height={180} src='/logo2.png' alt='logo' />
          </Link>
          {/* Address */}
          <p> Misr El Jadeda, Cairo, Egypt, Misr El Jadeda, Cairo, Egypt, Misr El Jadeda, Cairo, Egypt</p>
          {/* Mail and phone number*/}
          <span className='font-semibold'>ziaadmoataz@gmail.com</span>
          <span className='font-semibold'>+20 1012766890</span>
          {/* Icon container */}
          <div className='flex gap-6'>
            <Image src="/facebook.png" alt="Facebook" width={16} height={16}/>
            <Image src="/instagram.png" alt="instagram" width={16} height={16}/>
            <Image src="/youtube.png" alt="youtube" width={16} height={16}/>
            <Image src="/x.png" alt="x" width={16} height={16}/>
          </div>
        </div>

        {/* Center */}
        <div className='w-1/2 hidden lg:flex justify-between'>
          <div className='flex flex-col justify-between'>
            <h1 className='font-medium text-lg'>COMPANY</h1>
            <div className='flex flex-col  gap-6 '>
              <Link href='/'>About Us</Link>
              <Link href='/'>Careers</Link>
              <Link href='/'>Affiliates</Link>
              <Link href='/'>Blog</Link>
              <Link href='/'>Contact Us</Link>
            </div>
          </div>

          <div className='flex flex-col justify-between'>
            <h1 className='font-medium text-lg'>SHOP</h1>
            <div className='flex flex-col  gap-6 '>
              <Link href='/'>New Arrivals</Link>
              <Link href='/'>Accessories</Link>
              <Link href='/'>Men</Link>
              <Link href='/'>Women</Link>
              <Link href='/'>All Products</Link>
            </div>
          </div>

          <div className='flex flex-col justify-between'>
            <h1 className='font-medium text-lg'>HELP</h1>
            <div className='flex flex-col  gap-6 '>
              <Link href='/'>Customer Service</Link>
              <Link href='/'>My Account</Link>
              <Link href='/'>Find a Store</Link>
              <Link href='/'>Legal & Privacy</Link>
              <Link href='/'>Gift Card</Link>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className='w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8'>
          <h1 className='font-medium text-lg'>SUBSCRIBE</h1>
          <p>Be the first to get the latest news about trends, promotions, and much more!</p>
          <div className='flex'>
            <input type='text' placeholder='Email address' className='p-4 w-3/4'/>
            <button className='w-1/4 bg-myred text-white'>JOIN</button>
          </div>
          <span className='font-semibold'>Secure Payments</span>
          {/* Icon container */}
          <div className='flex justify-between'>
            <Image src="/discover.png" alt="discover" width={40} height={40}/>
            <Image src="/skrill.png" alt="skrill" width={40} height={40}/>
            <Image src="/paypal.png" alt="paypal" width={40} height={40}/>
            <Image src="/mastercard.png" alt="mastercard" width={40} height={40}/>
            <Image src="/visa.png" alt="visa" width={40} height={40}/>
        </div>
        </div>
      </div>

      {/* Bottom */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-8 mt-16'>
        <div className=''>© 2025 Vistora Shop</div>
        <div className='flex flex-col md:flex-row gap-8'>
          <div className=''>
            <span className='text-gray-500 mr-4'>Lanuages</span>
            <span className='font-medium'>United States | English</span>
          </div>
          <div className=''>
            <span className='text-gray-500 mr-4'>Currency</span>
            <span className='font-medium'>$ USD</span>
          </div>
        </div>
      </div>
    </div>
  )
}
