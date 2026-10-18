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
    }
  }
})

export const { addProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;

export const selectProducts = (state: RootState) => state.cart.products;
