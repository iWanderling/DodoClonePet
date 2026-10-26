import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { InCartProduct } from '../types/cart'
import type { RootState } from '../app/store'
import _ from 'lodash';

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

      function objToCompare(p: InCartProduct) {
        return {
          ...p,
          cart_id: 1,
          amount: 1,
          selectedToppings: (p.selectedToppings ? p.selectedToppings : []),
          removedOptions: (p.removedOptions ? p.removedOptions : [])
        }
      }

      let flag = false;
      for (let product of state.products) {
        if (_.isEqual(objToCompare(action.payload), objToCompare(product))) {
          flag = true;
          product.amount += 1;
          break;
        }
      }
      if (!flag) state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      return {
        ...state,
        products: state.products.filter(p => p.cart_id !== action.payload)
      }
    },
    changeProduct: (state, action: PayloadAction<InCartProduct>) => {
      function objToCompare(p: InCartProduct) {
        return {
          ...p,
          cart_id: 1,
          amount: 1,
          selectedToppings: (p.selectedToppings ? p.selectedToppings : []),
          removedOptions: (p.removedOptions ? p.removedOptions : [])
        }
      }
      const productToChange = state.products.find(p => p.cart_id === action.payload.cart_id);
      if (productToChange) {
        let flag = false;
        for (let product of state.products) {
          if (_.isEqual(objToCompare(action.payload), objToCompare(product))) {
            flag = true;
            product.amount += action.payload.amount;
            break;
          }
        }
        if (!flag) Object.assign(productToChange, action.payload);
      }
    },
    incrementProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      const product = state.products.find(p => p.cart_id === action.payload);
      if (product) product.amount += 1;
    },
    decrementProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      const product = state.products.find(p => p.cart_id === action.payload);
      if (product) {
        if (product.amount > 1) product.amount -= 1;
        else return {
          ...state,
          products: state.products.filter(p => p.cart_id !== action.payload)
        }
      }
    }
  }
})

export const { addProduct, removeProduct, changeProduct, incrementProduct, decrementProduct } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartAmount = (state: RootState) => state.cart.products.length;
export const selectProducts = (state: RootState) => state.cart.products;
export const selectTotalPrice = (state: RootState) => state.cart.products.reduce((sum, product) => (sum + product.price * product.amount), 0);
