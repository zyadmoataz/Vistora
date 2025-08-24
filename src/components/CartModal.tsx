// "use client"

// // import useWixClient from "@/hooks/useWixClient";
// import Image from "next/image";
// // import { useEffect } from "react";
// import { useCartStore } from './../hooks/useCartStore';
// import{media as wixMedia} from "@wix/sdk"
// import useWixClient from "@/hooks/useWixClient";
// import { currentCart } from "@wix/ecom";

// // to use the cart modal we will install: npm i @wix/ecom

// export default function CartModal() {
//     // temp
//     // const cartItems = true;

//     const wixClient =useWixClient();

//     const {cart, isLoading,removeItem} =useCartStore();

//     // function for the checkout and payment
//     const handleCheckout = async ()=>{
//       try{
//         // this will us the id and using this id we're going to create redirect session
//         // so we need to install redirect session > npm i @wix/redirects
//         const checkout =  await wixClient.currentCart.createCheckoutFromCurrentCart({
//           // our channel type is web
//           channelType:currentCart.ChannelType.WEB
//         });
//         const {redirectSession} = await wixClient.redirects.createRedirectSession({
//           ecomCheckout:{
//             checkoutId:checkout.checkoutId
//           },
//           callbacks:{
//             // localhost:3000
//             postFlowUrl:window.location.origin,
//             thankYouPageUrl:`${window.location.origin}/success`
//           }
//         });

//         if(redirectSession?.fullUrl){
//           window.location.href = redirectSession.fullUrl
//         }

//       }catch(err)
//       { 
//         console.log(err)
//       }
//     }

//     // return a promise so use it inside use effect
//     // we will run this also in the nav icons to update the number
//     // useEffect(()=>{
//     //   // const getCart = async () =>{
//     //   //   const response = await wixClient.currentCart.getCurrentCart();
//     //   //   console.log(response);
//     //   // }
//     //   getCart(wixClient);
//     // },[wixClient,getCart])

//     // console.log(cart);

//   return (
//     <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 z-20 flex flex-col gap-6"> 
//       {
//       !cart.lineItems? (
//         <div className='flex items-center justify-center h-32'>
//           Your cart is empty
//         </div>
//       ) : 
//       (<>
//         {/* Title */}
//         <h2 className="text-xl">Shopping  Cart</h2>

//         {/* List */}
//         <div className="flex flex-col gap-8">
//           {/* ITEM */}
//           { 
//             cart.lineItems.map((item)=>(
//             <div className=" flex gap-4" key={item._id}>
//                 {/* image comes in like this > image: "wix:image://v1/22e53e_efc1552d8050407f82ea158302d0debd~mv2.jpg/22e53e_efc1552d8050407f82ea158302d0debd~mv2.jpg#originWidth=4000&originHeight=4000" */}
//                 {/* the image needs to import wix media function to transform this to image url */}
//                 {/* <Image width={72} height={96} src='https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800' alt='' className="object-cover rounded-md" /> */}
//                 {/* pass image then width and height and we need no tranform option so make it empty object */}
//                {item.image && <Image width={72} height={96} src={wixMedia.getScaledToFillImageUrl(item.image,72,96,{})} alt='' className="object-cover rounded-md" />}
//                 <div>
//                     {/* Top Section */}
//                     <div className="flex flex-col justify-between w-full">
//                         {/* Title*/}
//                         <div className="flex justify-between items-center gap-8">
//                             {/* original title of the product name */}
//                             <h3 className="font-semibold">{item.productName?.original}</h3>
//                             <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
//                               {item.quantity && item.quantity>1 && <div className="text-sm text-green-500">{item.quantity} x</div>} 
//                               ${item.price?.amount}
//                             </div>
//                         </div>
//                         {/* Description */}
//                         <div className="text-sm text-gray-500 ">{item.availability?.status}</div>
//                     </div>
//                     {/* Bottom Section */}
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Qty: {item.quantity}</span>
//                       <span className="text-blue-500" style={{cursor:isLoading?"not-allowed":"pointer"}} onClick={()=>removeItem(wixClient, item._id!)}>Remove</span>
//                     </div>
//                 </div>
//             </div>
//             ))
//           }
//         </div>

//          {/* BOTTOM */}
//          <div className="">
//             <div className="flex items-center justify-between font-semibold">
//               <span className="">Subtotal</span>
//               <span className="">${cart?.subtotal.amount}</span>
//             </div>

//             <p className="text-gray-500 text-sm mt-2 mb-4">Shipping and taxes calculated at the checkout.</p>

//             <div className="flex justify-between text-sm">
//               <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">View Cart</button>
//               <button className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75" disabled={isLoading} onClick={handleCheckout}>Checkout</button>
//             </div>
//          </div>
//        </>
//       )}
//     </div>
//   )
// }

"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from './../hooks/useCartStore';
import { media as wixMedia } from "@wix/sdk"
import useWixClient from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";

export default function CartModal() {
    const wixClient = useWixClient();
    const { cart, isLoading: cartLoading, removeItem } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("paypal"); // Default to PayPal

    /**
     * Handle checkout with direct PayPal link
     * Uses the specific PayPal payment link provided
     */
    const handlePayPalCheckout = async () => {
      try {
        // Show loading state
        setIsLoading(true);
        
        // Direct PayPal payment link provided by the user
        const paypalDirectLink = "https://www.paypal.com/ncp/payment/P9FPE9TFZSWBS";
        
        // Save cart state to localStorage before redirecting (for demo purposes)
        try {
          // @ts-ignore - Handle different cart structure formats
          const cartTotal = cart?.subtotal?.amount || cart?.totals?.subtotal?.amount || '0.00';
          localStorage.setItem('lastCartTotal', cartTotal.toString());
          localStorage.setItem('lastCartDate', new Date().toISOString());
          localStorage.setItem('lastCartItemCount', String(cart?.lineItems?.length || 0));
        } catch (e) {
          console.log('Error saving cart data to localStorage');
        }
        
        // Redirect to the direct PayPal payment link
        window.location.href = paypalDirectLink;
      } catch (err) {
        console.error("PayPal checkout error:", err);
        setIsLoading(false);
        alert('There was an error connecting to PayPal. Please try again or view your full cart.');
      }
    };
    
    /**
     * Handle manual payment checkout
     */
    const handleManualCheckout = async () => {
      try {
          // Generate order without Wix checkout
          const generatedOrderId = `ORD-${Date.now()}`;
          
          // Get cart total safely
          // Use a safe way to access cart total regardless of the Wix API structure
          let orderTotal = '0.00';
          try {
              // @ts-ignore - Handle different Wix cart structures
              orderTotal = (cart.subtotal?.amount || cart.totals?.subtotal?.amount || '0.00').toString();
          } catch (e) {
              console.log('Could not determine cart total, using default');
          }
          
          // Store in localStorage for demo purposes
          localStorage.setItem('lastOrderId', generatedOrderId);
          localStorage.setItem('lastOrderAmount', orderTotal);
          localStorage.setItem('lastOrderDate', new Date().toISOString());
          
          setOrderId(generatedOrderId);
          setOrderSubmitted(true);
          
      } catch (err) {
          console.error("Order creation failed:", err);
      }
    };    

    if (!cart.lineItems) {
        return (
            <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 z-20 flex flex-col gap-6">
                <div className='flex items-center justify-center h-32'>
                    Your cart is empty
                </div>
            </div>
        );
    }

    return (
        <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 z-20 flex flex-col gap-6">
            {!orderSubmitted ? (
                <>
                    <h2 className="text-xl">Shopping Cart</h2>
                    <div className="flex flex-col gap-8">
                        {cart.lineItems.map((item) => (
                            <div className="flex gap-4" key={item._id}>
                                {item.image && (
                                    <Image
                                        width={72}
                                        height={96}
                                        src={wixMedia.getScaledToFillImageUrl(item.image, 72, 96, {})}
                                        alt=''
                                        className="object-cover rounded-md"
                                    />
                                )}
                                <div>
                                    <div className="flex flex-col justify-between w-full">
                                        <div className="flex justify-between items-center gap-8">
                                            <h3 className="font-semibold">{item.productName?.original}</h3>
                                            <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                                                {item.quantity && item.quantity > 1 && (
                                                    <div className="text-sm text-green-500">{item.quantity} x</div>
                                                )}
                                                ${item.price?.amount}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">{item.availability?.status}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Qty: {item.quantity}</span>
                                        <span
                                            className="text-blue-500"
                                            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                                            onClick={() => removeItem(wixClient, item._id!)}
                                        >
                                            Remove
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center justify-between font-semibold">
                            <span>Subtotal</span>
                            <span>
                                ${(() => {
                                    try {
                                        // @ts-ignore - Handle different Wix cart structures
                                        return cart?.subtotal?.amount || cart?.totals?.subtotal?.amount || '0.00';
                                    } catch (e) {
                                        return '0.00';
                                    }
                                })()}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 mb-4">
                            Shipping and taxes calculated at the checkout.
                        </p>
                        <div className="mb-3">
                            <h3 className="font-medium mb-2 text-sm">Payment Method</h3>
                            
                            {/* Payment method toggle */}
                            <div className="flex gap-2 mb-3">
                                <button
                                    className={`flex-1 py-2 rounded-md text-sm font-medium ${paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 124 33" className="inline-block">
                                            <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.696-1.746-4.985-1.746z" fill={paymentMethod === 'paypal' ? '#fff' : '#253B80'}/>
                                        </svg>
                                        PayPal
                                    </div>
                                </button>
                                <button
                                    className={`flex-1 py-2 rounded-md text-sm font-medium ${paymentMethod === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setPaymentMethod('manual')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        Manual
                                    </div>
                                </button>
                            </div>
                            
                            {/* Checkout buttons */}
                            <div className="flex justify-between gap-2">
                                <Link href="/cart" className="rounded-md py-3 px-2 ring-1 ring-gray-300 inline-block text-center flex-1 text-sm font-medium hover:bg-gray-50 transition-colors">
                                    View Cart
                                </Link>
                                <button
                                    className="rounded-md py-3 px-2 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75 flex items-center justify-center flex-1 text-sm font-medium"
                                    disabled={isLoading || cartLoading}
                                    onClick={paymentMethod === 'paypal' ? handlePayPalCheckout : handleManualCheckout}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        paymentMethod === 'paypal' ? (
                                            <>Pay with PayPal</>
                                        ) : (
                                            <>Manual Payment</>
                                        )
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white p-4 rounded border">
                    {/* Success Banner */}
                    <div className="bg-green-500 text-white p-3 rounded-md mb-4 flex items-start">
                        <div className="rounded-full bg-white p-1 mr-2 flex-shrink-0">
                          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-sm font-bold">Order Successfully Placed!</h2>
                          <p className="text-xs">Your order is on its way to you.</p>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="pb-3 mb-3 border-b flex items-center justify-between">
                        <h3 className="font-bold text-lg">Order #{orderId} Received!</h3>
                        <button 
                            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                            onClick={() => setOrderSubmitted(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>
                    
                    {/* Delivery Information */}
                    <div className="bg-blue-50 p-2 rounded mb-4 text-xs border border-blue-100">
                        <p className="font-medium text-blue-800 mb-1">Delivery Information:</p>
                        <p className="text-blue-700 mb-1">
                            <span className="font-medium">Estimated delivery:</span> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} (3 days)
                        </p>
                        <p className="text-blue-700">
                            <span className="font-medium">Note:</span> You can continue shopping while you wait for your order to arrive!
                        </p>
                    </div>
                    
                    <p className="mb-4">Thank you for your order! Please complete your payment using one of these methods:</p>
                    
                    <div className="space-y-3">
                        {/* Bank Transfer */}
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                                Bank Transfer
                            </p>
                            <div className="mt-2 bg-white p-2 rounded border border-gray-100 text-sm">
                                <p><span className="text-gray-600">Bank Name:</span> Your Bank</p>
                                <p><span className="text-gray-600">Account Number:</span> 123456789</p>
                                <p><span className="text-gray-600">Reference:</span> <span className="font-medium">{orderId}</span></p>
                            </div>
                        </div>
                        
                        {/* Cash Payment */}
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Cash Payment
                            </p>
                            <p className="mt-2 bg-white p-2 rounded border border-gray-100 text-sm">
                                Visit our store at: <span className="font-medium">[Your Address]</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Order Progress */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex justify-between mb-2 text-xs">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xxs mt-1">Order Placed</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10" />
                                    </svg>
                                </div>
                                <span className="text-xxs mt-1">Processing</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xxs mt-1">Shipped</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xxs mt-1">Delivered</span>
                            </div>
                        </div>
                        <div className="relative h-1 bg-gray-200 mt-1 mb-3">
                            <div className="h-full bg-blue-500" style={{ width: '30%' }}></div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t">
                        <p className="text-sm text-gray-600">After completing your payment, we'll verify and process your order.</p>
                        <div className="mt-3 flex justify-between">
                            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Continue Shopping
                            </Link>
                            <Link href="/cart" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Cart
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}