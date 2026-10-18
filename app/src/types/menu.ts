// Тип для меню (повторяет Product)
export type Menu = Product[];
export type Toppings = ProductToppings[];

// Универсальное описание для каждого товара
export interface Product {
  id: string, // ID
  title: string, // Название
  type: string, // Тип товара (пицца, закуска, напиток)
  inMenu: string[], // В каких разделах меню находится
  description: string | string[], // Описание товара
  isOptionalDescription: boolean, // Можно ли удалять ингредиенты из описания
  removableOptionalDescription?: string[], // Какие ингредиенты можно удалять из описания
  options: ProductOptions[], // Опции для товара (по размеру, количеству, типу и так далее)
  defaultKind: string,  // Тип товара по умолчанию
  defaultSize: number, // Размер / количество по умолчанию
  measurement_unit: string, // Мера исчисления (в граммах, милилитрах, поштучно)
  flag: string | null, // Флаг для плашки в меню (суперхит, скидка и так далее)
}

// Описание опций для каждого товара
export interface ProductOptions {
  kind: string, // Тип (виды теста, закусок или одиночный тип)
  price: number, // Цена
  size: number, // Количество или размер
  nutritionFacts?: { // Нутриенты ВКБЖУ
    calories: number,
    proteins?: number,
    fats?: number,
    carbohydrates?: number,
    weight?: number
  },
  imageSource: string, // Ссылка на изображение
  availableToppings?: string[], // Доступные для добавления начинки
  excludedToppings?: string[] // Исключённые начинки для данной опции
  toppingSize?: keyof ProductToppings["prices"]; // Размер начинки (для изменения цены)
  extraDescriptionInfo?: string, // Дополнительная информация для описания
  imageScale?: number // Дополнительная информация для изменения размера изображения
}

// Описание топпингов
export interface ProductToppings {
  id: string,
  title: string,
  type: string,
  imageSource: string,
  prices: {
    tiny: number,
    small: number,
    medium: number,
    large: number
  }
};