import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "../features/cartSlice"
import menuReducer from "../features/menuSlice"

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>