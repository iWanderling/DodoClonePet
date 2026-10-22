import type { ProductToppings } from "./menu"

// Тип продукта в корзине
export interface InCartProduct {
  cart_id: string,
  product_id: string,
  amount: number,
  kind: string,
  size: number,
  price: number,
  imageSource: string,
  title: string,
  selectedToppings?: ProductToppings["id"][],
  removedOptions?: string[]
}