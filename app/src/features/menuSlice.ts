import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Menu } from '../types/menu'
import type { RootState } from '../app/store'
import loadJson from '../utils/loadJson'

export interface StateMenu {
  menu: Menu,
  status: "idle" | "loading" | "failed"
}

const initialState: StateMenu = {
  menu: [],
  status: "idle"
}

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getMenuAsync.pending, state => {
        state.status = "loading"
      })
      .addCase(getMenuAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.menu = action.payload
      })
      .addCase(getMenuAsync.rejected, state => {
        state.status = "failed"
      })
  }
});

export default menuSlice.reducer;
export const selectMenu = (state: RootState) => state.menu.menu;

export const getMenuAsync = createAsyncThunk(
  "menu/fetchMenu",
  async () => {
    return await loadJson<Menu>("/data/products.json");
  }
)
