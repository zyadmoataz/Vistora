"use client";

// first we have to install > npm i @wix/stores @wix/sdk
// to check cookie we have to install > npm i js-cookie
// then install the types of the cookies > npm i --save-dev @types/js-cookie


import { createClient, OAuthStrategy } from '@wix/sdk';
import { products ,collections} from '@wix/stores';
import { currentCart} from '@wix/ecom'; //this is for the add to cart modal
import { redirects} from '@wix/redirects'; //this is for the add to cart modal
import Cookies from "js-cookie"
import { createContext,ReactNode } from 'react';

const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}") ; //if it doesn't exist make it equal empty object

//To access the Wix APIs, create a client with the createClient() function imported from the @wix/sdk package.
const wixClient = createClient({

  modules: {    
     products,
     collections,
     currentCart,
     redirects
  },
  auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! ,
        tokens:{
            refreshToken,
            accessToken:{
                value:"",
                expiresAt:0
            }
        }
    }),
});


// create wix client context
export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient)

// then we can export my provider

// Children stands for all app
export const WixClientContextProvider = ({children }:{children:ReactNode}) => {
    return (
        <WixClientContext.Provider value={wixClient}>
            {children}
        </WixClientContext.Provider>
    )
}