import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";


// define state type
type CartState = {
  cart: currentCart.Cart;
  isLoading: boolean;
  counter: number;
 //   we cannot add our wixClient here as this is not a component
  getCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    //   this is true as when we visit our website we are gonna get our car => getCar() and after fetching our cart it will be false
  isLoading: true,
  counter: 0,
//   when we get an item
  getCart: async (wixClient) => {
    try {
    //we will fetch our cart 
      const cart = await wixClient.currentCart.getCurrentCart();
    //   set our state
      set({
        cart: cart || {},
        isLoading: false,
        counter: cart?.lineItems.length || 0,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
//   when we add an item
  addItem: async (wixClient, productId, variantId, quantity) => {
    // write the previous state dont change it  then add our item as we need (productId, variantId, quantity) to add any other new item
    set((state) => ({ ...state, isLoading: true }));
    const response = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
            catalogItemId: productId,
            ...(variantId && { options: { variantId } }),
          },
          quantity: quantity,
        },
      ],
    });

    // after that we can update our cart by adding new item
    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
  },
//   when we remeove an item
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
      [itemId]
    );

    // after removing the item upate our cart
    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
  },
}));