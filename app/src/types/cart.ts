import type { Toppings } from "./menu"

// Тип продукта в корзине
export interface InCartProduct {
  cart_id: number,
  product_id: string,
  amount: number,
  kind: string,
  size: number,
  selectedToppings?: Toppings,
  removedOptions?: string[]
}