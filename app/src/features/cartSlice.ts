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
      state.products.filter(product => product.cart_id != action.payload);
    },
    incrementProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      const product = state.products.find(product => product.cart_id === action.payload);
      if (product) product.amount += 1;
    },
    decrementProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      const product = state.products.find(product => product.cart_id === action.payload);
      if (product) product.amount -= 1;
    }
  }
})

export const { addProduct, removeProduct, incrementProduct, decrementProduct } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartAmount = (state: RootState) => state.cart.products.length;
export const selectProducts = (state: RootState) => state.cart.products;
export const selectTotalPrice = (state: RootState) => state.cart.products.reduce((sum, product) => (sum + product.price * product.amount), 0);
