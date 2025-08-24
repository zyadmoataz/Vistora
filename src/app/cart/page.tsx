"use client";

// Import necessary dependencies
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import useWixClient from "@/hooks/useWixClient";
import { media as wixMedia } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import Link from "next/link";
// Import Stripe library for payment processing
import { loadStripe } from "@stripe/stripe-js";

export default function CartPage() {
  // Initialize Wix client and cart data
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, getCart } = useCartStore();
  
  // State management for the cart page
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal"); // Default payment method
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false); // Loading state during checkout
  const [orderId, setOrderId] = useState<string | null>(null); // Store order ID after successful checkout
  const [orderComplete, setOrderComplete] = useState<boolean>(false); // Track if order is complete
  const [stripeError, setStripeError] = useState<string | null>(null); // Track Stripe errors
  
  /**
   * Helper function to safely get the cart total amount
   * This handles any type discrepancies in the Wix cart object
   */
  const getCartTotal = () => {
    // @ts-ignore - Wix types may not match actual API response
    return (cart?.subtotal?.amount || cart?.totals?.subtotal?.amount || '0.00');
  }
  
  /**
   * Calculate shipping cost based on order total
   * Shipping is $100 but free if order exceeds $1000
   */
  const getShippingCost = () => {
    const subtotal = Number(getCartTotal());
    return subtotal >= 1000 ? 0 : 100;
  }
  
  /**
   * Calculate the total order amount including shipping
   */
  const getOrderTotal = () => {
    const subtotal = Number(getCartTotal());
    const shipping = getShippingCost();
    return (subtotal + shipping).toFixed(2);
  }

  // Fetch cart data when component mounts
  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  /**
   * Handle PayPal checkout process using the specific PayPal link provided
   * This bypasses the Wix API and goes directly to the PayPal payment page
   */
  const handlePayPalCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Direct PayPal payment link provided by the user
      const paypalDirectLink = "https://www.paypal.com/ncp/payment/P9FPE9TFZSWBS";
      
      // Show a confirmation message
      // alert('You will now be redirected to PayPal for payment processing. This is using a direct PayPal payment link for testing purposes.');
      
      // Save cart state to localStorage before redirecting (for demo purposes)
      localStorage.setItem('lastCartTotal', getCartTotal());
      localStorage.setItem('lastCartDate', new Date().toISOString());
      localStorage.setItem('lastCartItemCount', String(cart?.lineItems?.length || 0));
      
      // Redirect to the direct PayPal payment link
      window.location.href = paypalDirectLink;
    } catch (err) {
      console.error("PayPal checkout error:", err);
      setIsCheckingOut(false);
      alert('There was an error connecting to PayPal. Please try again or choose a different payment method.');
    }
  };

  /**
   * Handle Stripe checkout process
   * This is a test implementation for demonstration purposes
   */
  const handleStripeCheckout = async () => {
    setIsCheckingOut(true);
    setStripeError(null);
    try {
      // For testing purposes, we're simulating a Stripe checkout
      // In a real implementation, you would:
      // 1. Call your backend to create a Stripe checkout session
      // 2. Redirect to Stripe's checkout page
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a fake order ID
      const stripeOrderId = `STRIPE-${Date.now()}`;
      setOrderId(stripeOrderId);
      setOrderComplete(true);
      
      // In a real implementation with Stripe:
      // const stripePromise = loadStripe('your_publishable_key');
      // const stripe = await stripePromise;
      // const { error } = await stripe.redirectToCheckout({
      //   sessionId: 'session_id_from_server'
      // });
      // if (error) setStripeError(error.message);
      
    } catch (err) {
      console.error("Stripe checkout error:", err);
      setStripeError("There was an error processing your payment with Stripe.");
      setIsCheckingOut(false);
    }
  };

  /**
   * Handle manual payment checkout
   * Generates an order ID and marks the order as complete
   * For testing purposes - simulates placing an order for manual payment
   */
  const handleManualCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Show processing message
      // This simulates the server-side processing that would happen in a real store
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a simple order ID for manual payment
      const generatedOrderId = `ORD-${Date.now()}`;
      
      // In a real implementation, you would also:
      // 1. Send the order to your backend API
      // 2. Save the order details in a database
      // 3. Send confirmation emails
      // 4. Update inventory
      
      // For testing, we're just setting state in the UI
      setOrderId(generatedOrderId);
      setOrderComplete(true);
      
      // Simulate storing order in browser for demo purposes
      localStorage.setItem('lastOrderId', generatedOrderId);
      localStorage.setItem('lastOrderAmount', getCartTotal());
      localStorage.setItem('lastOrderDate', new Date().toISOString());
    } catch (err) {
      console.error("Manual checkout error:", err);
      setIsCheckingOut(false);
      alert('There was an error processing your order. Please try again.');
    }
  };

  /**
   * Main checkout handler
   * Routes to the appropriate payment method handler based on user selection
   */
  const handleCheckout = async () => {
    if (paymentMethod === "paypal") {
      await handlePayPalCheckout();
    } else if (paymentMethod === "stripe") {
      await handleStripeCheckout();
    } else if (paymentMethod === "manual") {
      await handleManualCheckout();
    }
  };

  // If cart is loading, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading your cart...</div>
        </div>
      </div>
    );
  }

  // If cart is empty, show empty cart message
  if (!cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // If order is complete (for manual payment), show order confirmation
  if (orderComplete) {
    // Calculate estimated delivery date (3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          {/* Order Success Banner */}
          <div className="bg-green-500 text-white p-4 rounded-md mb-6 flex items-start">
            <div className="rounded-full bg-white p-2 mr-3 flex-shrink-0">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">Order Successfully Placed!</h2>
              <p>Your order is on its way to you. Thank you for shopping with us!</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
          
          {/* Order Details */}
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Thank you for your order!</h2>
            <p className="mb-1">Order ID: <span className="font-medium">{orderId}</span></p>
            <p className="mb-2">Total Amount: <span className="font-medium">${getOrderTotal()}</span></p>
            
            {/* Delivery Information */}
            <div className="bg-white p-3 rounded-md border border-gray-200 mb-4">
              <h3 className="font-medium text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Delivery Information
              </h3>
              <div className="mt-2 text-sm">
                <p className="mb-1"><span className="text-gray-600">Estimated Delivery:</span> <span className="font-semibold text-gray-800">{formattedDeliveryDate}</span></p>
                <p className="mb-1"><span className="text-gray-600">Delivery Method:</span> <span className="font-semibold text-gray-800">Standard Shipping</span></p>
                <p><span className="text-gray-600">Status:</span> <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Processing</span></p>
              </div>
            </div>

            <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded-md">
              <strong>Note:</strong> You can continue shopping and add more items to your cart while waiting for your order to arrive!
            </p>
            
            {/* Show appropriate payment instructions based on payment method */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {paymentMethod === "manual" ? (
                <>
                  <h3 className="font-semibold mb-2">Manual Payment Instructions:</h3>
                  <p className="mb-1">Please complete your payment using the following details:</p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>Bank Name: Your Bank Name</li>
                    <li>Account Number: 123456789</li>
                    <li>Reference: {orderId}</li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-800 mb-1">📱 Payment Options</p>
                    <p className="text-sm text-blue-700 mb-2">For testing purposes, you can also use these methods:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-xs text-gray-600">Pay when your order arrives</p>
                      </div>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <p className="font-medium">Mobile Transfer</p>
                        <p className="text-xs text-gray-600">Send to: +1234567890</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    After completing your payment, please send your payment confirmation to our email: support@example.com
                  </p>
                </>
              ) : paymentMethod === "stripe" ? (
                <>
                  <h3 className="font-semibold mb-2">Stripe Payment Confirmation</h3>
                  <p className="mb-1">
                    Your test payment with Stripe has been successfully processed. 
                    In a real implementation, you would receive an email confirmation.
                  </p>
                  <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                    <p className="font-medium">Test Transaction Details:</p>
                    <p>Transaction ID: STRIPE-TEST-{Date.now().toString().slice(-6)}</p>
                    <p>Payment Method: Credit Card (Stripe)</p>
                    <p>Status: Completed (Test)</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold mb-2">PayPal Payment Confirmation</h3>
                  <p className="mb-1">
                    Your test payment with PayPal has been successfully processed. 
                    In a real implementation, you would be redirected to PayPal's site to complete payment.
                  </p>
                </>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition text-center flex-1 max-w-xs mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Continue Shopping
            </Link>
            <button 
              onClick={() => window.print()} 
              className="border border-gray-300 bg-gray-50 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-100 transition text-center flex-1 max-w-xs mx-auto flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
          </div>
          
          {/* Tracking Information */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-3">Track Your Order</h3>
            <p className="text-gray-600 mb-4">You will receive an email confirmation with tracking information once your order ships.</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs mt-1">Order Placed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10" />
                      </svg>
                    </div>
                    <span className="text-xs mt-1">Processing</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs mt-1">Shipped</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs mt-1">Delivered</span>
                  </div>
                </div>
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
                  <div className="h-full bg-blue-500" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      {/* Cart items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cart header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>
            
            {/* Cart items */}
            <div className="divide-y divide-gray-200">
              {cart.lineItems.map((item) => (
                <div key={item._id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-wrap">
                  {/* Product info */}
                  <div className="col-span-6 flex items-center gap-4 mb-4 md:mb-0">
                    {/* Product image */}
                    {item.image && (
                      <div className="w-20 h-20 flex-shrink-0">
                        <Image
                          width={80}
                          height={80}
                          src={wixMedia.getScaledToFillImageUrl(item.image, 80, 80, {})}
                          alt={item.productName?.original || "Product"}
                          className="object-cover rounded-md w-full h-full"
                        />
                      </div>
                    )}
                    
                    {/* Product details */}
                    <div>
                      <h3 className="font-medium">{item.productName?.original}</h3>
                      <p className="text-sm text-gray-500">{item.availability?.status}</p>
                      <button
                        className="text-red-500 text-sm mt-2 hover:underline"
                        onClick={() => removeItem(wixClient, item._id!)}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-2 text-center">
                    <div className="md:hidden inline-block text-gray-500 mr-2">Price:</div>
                    ${item.price?.amount}
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-2 text-center">
                    <div className="md:hidden inline-block text-gray-500 mr-2">Qty:</div>
                    {item.quantity}
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-2 text-center font-medium">
                    <div className="md:hidden inline-block text-gray-500 mr-2">Total:</div>
                    ${(Number(item.price?.amount || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Continue shopping button */}
          <div className="mt-6">
            <Link href="/" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            {/* Subtotal */}
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${getCartTotal()}</span>
            </div>
            
            {/* Shipping - calculated based on order total */}
            <div className="flex justify-between mb-2">
              <span className="flex items-center">
                Shipping
                {getShippingCost() > 0 && (
                  <span className="ml-2 text-xs text-blue-600">
                    (Free shipping if order exceeds $1000)
                  </span>
                )}
              </span>
              <span>
                {getShippingCost() > 0 ? `$${getShippingCost().toFixed(2)}` : (
                  <span className="text-green-600 font-medium">Free</span>
                )}
              </span>
            </div>
            
            {/* Tax - placeholder for demo */}
            <div className="flex justify-between mb-2 pb-4 border-b border-gray-200">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            
            {/* Total - includes subtotal + shipping */}
            <div className="flex justify-between my-4 font-bold text-lg">
              <span>Total</span>
              <span>${getOrderTotal()}</span>
            </div>
            
            {/* Payment method selection */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="space-y-3">
                {/* PayPal option */}
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-md hover:bg-gray-50 transition-colors" htmlFor="paypal">
                  <input
                    id="paypal"
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="flex items-center justify-between w-full">
                    {/* <span className="flex items-center gap-2"> */}
                      <Image 
                        src="/paypal.png" 
                        alt="PayPal" 
                        width={60} 
                        height={20} 
                        onError={(e) => {
                          // Fallback to inline SVG if the image isn't available
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentNode;
                          if (parent) {
                            const div = document.createElement('div');
                            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 124 33"><path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zm19.654-.079h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zm22.007-6.374h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/><path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zm19.653-.079h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zm8.426-12.219l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/><path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill="#253B80"/><path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/><path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/><path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/></svg>';
                            parent.appendChild(div.firstChild);
                          }
                        }}
                      />
                      {/* <span className="font-medium">PayPal</span> */}
                    {/* </span> */}
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Test Available</span>
                  </div>
                </label>
                
                {/* Manual payment option */}
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-md hover:bg-gray-50 transition-colors" htmlFor="manual">
                  <input
                    id="manual"
                    type="radio"
                    name="paymentMethod"
                    value="manual"
                    checked={paymentMethod === "manual"}
                    onChange={() => setPaymentMethod("manual")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <div className="bg-gray-200 rounded-md p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">Manual Payment</span>
                    </span>
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Test Available</span>
                  </div>
                </label>
                
                {/* Payment notes */}
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                  <p className="font-medium">📝 Note:</p>
                  <p>Both payment methods are fully functional for testing. No real charges will be made.</p>
                  <p className="mt-2">PayPal will redirect you to their sandbox environment where you can complete a test transaction.</p>
                </div>
              </div>
            </div>
            
            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <span className="relative z-10">Place Order Now</span>
                  <span className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </>
              )}
            </button>
            
            {/* Trust indicators */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Testing Mode
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                This is a fully functional test checkout. You can complete real payment flows, but no actual charges will be processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
