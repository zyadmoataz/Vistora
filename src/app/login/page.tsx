"use client";
import useWixClient from '@/hooks/useWixClient';
import { LoginState } from "@wix/sdk";
import React, { useState } from 'react'
import { usePathname ,useRouter} from 'next/navigation';
import Cookies from 'js-cookie';


// Mode types:
enum MODE {
LOGIN="LOGIN",
REGISTER="REGISTER",
RESET_PASSWORD="RESET_PASSWORD",
EMAIL_VERIFICATION="EMAIL_VERIFICATION"
}



export default function LoginPage() {

  const wixClient = useWixClient();
  const pathname = usePathname(); // this is used to redirect the url in the reset password case
  const router = useRouter(); //to be redirected to the homepage after login and it must come from navigation
  const isLoggedIn = wixClient.auth.loggedIn();

  // console.log(isLoggedIn); //it will print true if i logged in and opened the login page even if we refreshed the page as token is taken from the cookie
  // if we are logged in we wont see this page
  if(isLoggedIn)
  {
    router.push("/")
  }

  const [mode,setMode]=useState(MODE.LOGIN);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [emailCode,setEmailCode ]=useState("");
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(""); //for error
  const [message,setMessage]=useState(""); //for succussful

  const formTitle = mode ===MODE.LOGIN ? "Log in" : mode ===MODE.REGISTER ? "Register" : mode ===MODE.RESET_PASSWORD ? "Reset Your Password" : "Verify Your Email" 
  const buttonTitle = mode ===MODE.LOGIN ? "Login" : mode ===MODE.REGISTER ? "Register" : mode ===MODE.RESET_PASSWORD ? "Reset" : "Verify" 


  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault(); //dont want to refresh the page
    setIsLoading(true);
    setError("");

    try{
      let response;
      // we need switch as we have 4 modes:
      switch(mode){

            // FROM WIX DOCUMENTATION
            // let response = await myWixClient.auth.login({
            //   email: "<MEMBER_EMAIL>",
            //   password: "<MEMBER_PASSWORD>",
            // });  
        case MODE.LOGIN:  
          response = await wixClient.auth.login({
              email,
              password,
            });
            break;
        case MODE.REGISTER:  
          response = await wixClient.auth.register({
              email,
              password,
              profile:{nickname:username} //additional 
            });
            break;
        case MODE.RESET_PASSWORD:  
          response = await wixClient.auth.sendPasswordResetEmail(
              email,
              pathname //the redirect url
            );
            setMessage("Password email sent. Please check your e-mail.")
            break;
        case MODE.EMAIL_VERIFICATION:  
          response = await wixClient.auth.processVerification({
              verificationCode:emailCode  
              });
            break;
        default:
          break;
      }

      //before register
      // console.log(response); //{loginState: 'FAILURE', error: '{\n  "message": "wrong password: UNKNOWN",\n  "detai…   "code": "-19976",\n      "data": {}\n    }\n  }\n}', errorCode: 'invalidPassword'}
      
      //after register
      // console.log(response); //{loginState: 'SUCCESS', data: {…}}data: {sessionToken: 'MST2.eyJraWQiOiJTQTFOQnVNMyIsImFsZyI6IlJTMjU2In0.e…x2-gZImUj17kRfj_wukcxxypxE0Pui5z15cT8wlysle_qND8g'}\loginState: "SUCCESS"

      // this session token has our refresh token and access token  
      // we need to decrept this session token and get our refresh and access token
      // so that we eill be using this function "getMemberTokensForDirectLogin"
      // tokens will be: accessToken: {value: 'OauthNG.JWS.eyJraWQiOiJZSEJzdUpwSCIsImFsZyI6IkhTMj…jg1fQ.l4JzA7XFzOZEsIA6jZdVzvMhqPf4xnqoDmifs_WWo1I', expiresAt: 1744918284}refreshToken: {value: 'JWS.eyJraWQiOiJZSEJzdUpwSCIsImFsZyI6IkhTMjU2In0.ey…Dg1fQ.dllxj55MJw6L-CR6IDO9pHF-CnGIX10-6J5uTJU_r7Y', role: 'member'}
      
      // then we will make another switch for the login state (if success or faliure or pending)
      switch (response?.loginState) {
        case LoginState.SUCCESS:
          setMessage("Successful! You are being redirected.");
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          );
          // console.log(tokens); //get our refresh and access token

          // we are using js cookie to update the token inside it
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
          });
      
          // now we will update our token given through the wixClient in the wixContext
          wixClient.auth.setTokens(tokens);
          // after that we will be redirected to the homepage
          router.push("/");
          break;

        case LoginState.FAILURE:
          if (                                                                    
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            setError("Invalid email or password!");
          } else if (response.errorCode === "emailAlreadyExists") {
            setError("Email already exists!");
          } else if (response.errorCode === "resetPassword") {
            setError("You need to reset your password!");
          } else {
            setError("Something went wrong!");
          }

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);

        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is pending approval");

        default:
          break;
      }

    }catch(err){
      console.log(err);
      setError("Something went wrong!");  
    }finally{
      setIsLoading(false); 
    }
  }

  return (
    <div className='h-[calc(100vh-100px)]  px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center'>
      <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
        <h1 className='text-2xl font-semibold'>{formTitle}</h1>
        {
          mode===MODE.REGISTER ? 
          (
            <div className='flex flex-col gap-2'>
              <label className="text-sm text-gray-700">Username</label>
              <input type="text" name="username" placeholder="john" className='ring-2 ring-gray-300 rounded-md p-4' onChange={ e => setUsername(e.target.value)}/>
            </div>
          )
          : null
        }

        {/* This email is common and connected with all forms except for the email verification */}
        {
          mode!== MODE.EMAIL_VERIFICATION ? 
          (
            <div className='flex flex-col gap-2'>
              <label className="text-sm text-gray-700">Email</label>
              <input type="email" name="email" placeholder="john@gmail.com" className='ring-2 ring-gray-300 rounded-md p-4' onChange={ e => setEmail(e.target.value)}/>
            </div>
          )
          :
          (
            <div className='flex flex-col gap-2'>
              <label className="text-sm text-gray-700">Verification Code</label>
              <input type="text" name="emailCode" placeholder="Code" className='ring-2 ring-gray-300 rounded-md p-4' onChange={ e => setEmailCode(e.target.value)}/>
            </div>
          )
        }

        {/* Show password on login or register only */}
        {
           mode === MODE.LOGIN || mode === MODE.REGISTER ? 
           (
             <div className='flex flex-col gap-2'>
               <label className="text-sm text-gray-700">Password</label>
               <input type="password" name="password" placeholder="Enter your password" className='ring-2 ring-gray-300 rounded-md p-4' onChange={ e => setPassword(e.target.value)} />
             </div>
           )
           :
           null
        }

        {/* After password in login page */}
        {
          mode ===MODE.LOGIN &&
          (
            <div className="text-sm underline cursor-pointer" onClick={()=>setMode(MODE.RESET_PASSWORD)}>Forgot Password?</div>
          )
        }


        {/* All forms have buttons */}
        <button className='bg-myred text-white rounded-md p-2 disabled:bg-pink-200 disabled:cursor:not-allowed' disabled={isLoading}>{isLoading? "Loading..." : buttonTitle}</button>
        
        {/* For any error */}
        {error && <div className="text-red-600">{error}</div>}

        {/* For Login */}
        {
          mode ===MODE.LOGIN ?
          (
            <div className="text-sm underline cursor-pointer" onClick={(()=>setMode(MODE.REGISTER))}> {"Don't"} have an account?</div>
          )
          :null
        }

        {/* For Register */}
        {
          mode ===MODE.REGISTER ?
          (
            <div className="text-sm underline cursor-pointer" onClick={(()=>setMode(MODE.LOGIN))}> {"Don't"} Have an account?</div>
          )
          :null
        }

        {/* For Rest Password */}
        {
          mode ===MODE.RESET_PASSWORD ?
          (
            <div className="text-sm underline cursor-pointer"onClick={(()=>setMode(MODE.LOGIN))}> {"Don't"} Go back to Login</div>
          )
          :null
        }

        {/* Any message */}
        {
          message && (<div className="text-green-600 text-sm">{message}</div>)
        }
      </form>
    </div>
  )
}
