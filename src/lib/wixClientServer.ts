// when we fetch any data from the backend we will use server side wix client
// we dont need the current cart as its related to the user

import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections,products } from '@wix/stores';
import {cookies} from "next/headers"; //we can reach our cookie from next headers


export const wixClientServer = async ()=>{
    let refreshToken;    
    
    try{
        const cookieStore =cookies();
        refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}") ; //if it doesn't exist make it equal empty object
    }
    catch(e)
    {}
    
    // we will use this for fetching our data
     const wixClient = createClient({
        
        modules: {    
            products,
            collections
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
    
    return wixClient;
}