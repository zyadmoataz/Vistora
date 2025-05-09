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
import { useState } from "react";
import { useCartStore } from './../hooks/useCartStore';
import { media as wixMedia } from "@wix/sdk"
import useWixClient from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";

export default function CartModal() {
    const wixClient = useWixClient();
    const { cart, isLoading, removeItem } = useCartStore();
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const handleManualCheckout = async () => {
      try {
          // Generate order without Wix checkout
          const generatedOrderId = `ORD-${Date.now()}`;
          
          // Send order to your own backend
          const response = await fetch('/api/create-order', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  items: cart.lineItems.map(item => ({
                      id: item._id,
                      name: item.productName?.original,
                      quantity: item.quantity,
                      price: item.price?.amount
                  })),
                  total: cart.subtotal.amount,
                  orderId: generatedOrderId
              }),
          });
  
          if (!response.ok) {
              throw new Error('Order submission failed');
          }
  
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
                            <span>${cart?.subtotal.amount}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 mb-4">
                            Shipping and taxes calculated at the checkout.
                        </p>
                        <div className="flex justify-between text-sm">
                            <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                                View Cart
                            </button>
                            <button
                                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                                disabled={isLoading}
                                onClick={handleManualCheckout}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-bold text-lg mb-2">Order #{orderId} Received!</h3>
                    <p className="mb-4">Please complete your payment using one of these methods:</p>
                    
                    <div className="space-y-2">
                        <p><strong>Bank Transfer:</strong></p>
                        <p>Bank Name: Your Bank</p>
                        <p>Account Number: 123456789</p>
                        <p>Reference: Order #{orderId}</p>
                        
                        <p className="mt-4"><strong>Cash Payment:</strong></p>
                        <p>Visit our store at [Your Address]</p>
                        
                        <p className="mt-4">After payment, we'll verify and process your order.</p>
                    </div>
                </div>
            )}
        </div>
    );
}