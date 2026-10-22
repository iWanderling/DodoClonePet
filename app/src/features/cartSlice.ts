import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { InCartProduct } from '../types/cart'
import type { RootState } from '../app/store'

export interface CartState {
  products: InCartProduct[]
}

const initialState: CartState = {
  products: []
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<InCartProduct>) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      state.products = state.products.filter(product => product.cart_id !== action.payload);
    },
    changeProduct: (state, action: PayloadAction<InCartProduct>) => {
      const productToChange = state.products.find(product => product.cart_id === action.payload.cart_id);
      if (productToChange) Object.assign(productToChange, action.payload);
    },
    incrementProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      const product = state.products.find(product => product.cart_id === action.payload);
      if (product) product.amount += 1;
    },
    decrementProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      const product = state.products.find(product => product.cart_id === action.payload);
      if (product) {
        if (product.amount > 1) product.amount -= 1;
        else state.products = state.products.filter(product => product !== product);
      }
    }
  }
})

export const { addProduct, removeProduct, changeProduct, incrementProduct, decrementProduct } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartAmount = (state: RootState) => state.cart.products.length;
export const selectProducts = (state: RootState) => state.cart.products;
export const selectTotalPrice = (state: RootState) => state.cart.products.reduce((sum, product) => (sum + product.price * product.amount), 0);
