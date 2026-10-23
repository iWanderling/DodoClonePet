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

      // action.payload
      const productEq1: InCartProduct = {
        ...action.payload,
        selectedToppings: (action.payload.selectedToppings ? action.payload.selectedToppings : []),
        removedOptions: (action.payload.removedOptions ? action.payload.removedOptions : [])
      }

      let flag = false;
      for (let product of state.products) {

        // product from cart
        const productEq2: InCartProduct = {
          ...product,
          cart_id: action.payload.cart_id,
          amount: action.payload.amount,
          selectedToppings: (product.selectedToppings ? product.selectedToppings.toSorted((a, b) => a.localeCompare(b)) : []),
          removedOptions: (product.removedOptions ? product.removedOptions.toSorted((a, b) => a.localeCompare(b)) : [])
        }

        if (_.isEqual(productEq1, productEq2)) {
          flag = true;
          Object.assign(product, { ...action.payload, amount: product.amount + 1 });

        }
      }
      if (!flag) state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<InCartProduct["cart_id"]>) => {
      state.products = state.products.filter(product => product.cart_id !== action.payload);
    },
    changeProduct: (state, action: PayloadAction<InCartProduct>) => {
      const productToChange = state.products.find(product => product.cart_id === action.payload.cart_id);
      if (productToChange) {

        // action.payload
        const productEq1: InCartProduct = {
          ...action.payload,
          selectedToppings: (action.payload.selectedToppings ? action.payload.selectedToppings : []),
          removedOptions: (action.payload.removedOptions ? action.payload.removedOptions : [])
        }
        let flag = false;

        for (let product of state.products) {

          // product from cart
          const productEq2: InCartProduct = {
            ...product,
            cart_id: productEq1.cart_id,
            amount: productEq1.amount,
            selectedToppings: (product.selectedToppings ? product.selectedToppings.toSorted((a, b) => a.localeCompare(b)) : []),
            removedOptions: (product.removedOptions ? product.removedOptions.toSorted((a, b) => a.localeCompare(b)) : [])
          }

          if (_.isEqual(productEq1, productEq2)) {
            flag = true;
            Object.assign(product, { ...action.payload, amount: product.amount + action.payload.amount });
            state.products = state.products.filter(product => product !== productToChange);
          }
        }
        if (!flag) Object.assign(productToChange, action.payload);;
      }
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
