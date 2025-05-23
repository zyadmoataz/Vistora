"use client";
import Image from 'next/image';
import Link from 'next/link';
import {usePathname ,useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CartModal from './CartModal';
import useWixClient from '@/hooks/useWixClient';
import Cookies from "js-cookie";
import { useCartStore } from '@/hooks/useCartStore';

export default function NavIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const router = useRouter();
  // Temporary isLoggedIn
  // const isLoggedIn =false;
    const wixClient = useWixClient();
    const router = useRouter(); //to be redirected to the homepage after login and it must come from navigation
    const pathname = usePathname(); // this is used to redirect the login page after logout
    const isLoggedIn = wixClient.auth.loggedIn();
    
  const handleProfile = () => {
    if(!isLoggedIn)
    {
      router.push('/login');
    }
    else{
      setIsProfileOpen(prev => !prev);
    }
  }

    // const wixClient = useWixClient();
  //AUTH WITH WIX-MANAGED AUTH
  // const login = async ()=>{

  //   const loginRequestData = wixClient.auth.generateOAuthData(
  //     "http://localhost:3000"
  //   );

  //   // save that data in the local storage
  //   localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));

  //   const {authUrl} = await wixClient.auth.getAuthUrl(loginRequestData); //this will generate a unique url and with it we can reach to wix website
  //   window.location.href = authUrl;
  // } 

  const handleLogout = async ()=>{
    setIsLoading(true);
    Cookies.remove("refreshToken");
    // const { logoutUrl } = await wixClient.auth.logout(pathname); 
    const { logoutUrl } = await wixClient.auth.logout(window.location.href); 
    setIsLoading(false);
    setIsProfileOpen(false); //close our modal
    router.push(logoutUrl)
  }

    // to update the number of the notification add to cart
    const {cart, counter,getCart} = useCartStore();
    useEffect(()=>{
      getCart(wixClient);
    },[wixClient,getCart])

  return (
    <div className='flex gap-4 items-center xl:gap-6 relative'>
      <Image width={22} height={22} src="/profile.png" alt="profile" className='cursor-pointer' onClick={handleProfile}/>
      {/* <Image width={22} height={22} src="/profile.png" alt="profile" className='cursor-pointer' onClick={login}/> */}
        {isProfileOpen && (
          <div className='absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20'>
            <Link href='/'>Profile</Link>
            <div className='mt-2 cursor-pointer' onClick={handleLogout}>{isLoading?"Logging out":"Logout"}</div>
          </div> 
        )}

      <Image width={22} height={22} src="/notification.png" alt="notification" className='cursor-pointer' />
      <div className='relative cursor-pointer' onClick={()=>setIsCartOpen((prev)=>!prev)}>
        <Image width={22} height={22} src="/cart.png" alt ="cart" className='cursor-pointer'/>
        <div className='absolute -top-4 -right-4 w-6 h-6 bg-myred rounded-full text-white text-sm flex items-center justify-center'>{counter}</div>
      </div>
      {isCartOpen && (
        <CartModal />
      )}
    </div>
  )
}
