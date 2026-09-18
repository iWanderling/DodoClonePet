import "./ProductPage.css"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { RemoveScroll } from "react-remove-scroll"

// Тип для меню (повторяет Product)
type Menu = Product;
type Ingredients = null;

// Универсальное описание для каждого товара
interface Product {
  id: string, // ID
  title: string, // Название
  type: string, // Тип товара (пицца, закуска, напиток)
  inMenu: string[], // В каких разделах меню находится
  description: string | string[], // Описание товара
  isOptionalDescription: boolean, // Можно ли удалять ингредиенты из описания
  removableOptionalDescription?: string[], // Какие ингредиенты можно удалять из описания
  options: ProductOptions[], // Опции для товара (по размеру, количеству, типу и так далее)
  measurement_unit: string, // Мера исчисления (в граммах, милилитрах, поштучно)
  flag: string | null, // Флаг для плашки в меню (суперхит, скидка и так далее)
}

// Описание опций для каждого товара
type ProductOptions = {
  kind: string, // Тип (виды теста, закусок или одиночный тип)
  price: number, // Цена
  size: number, // Количество или размер
  nutritionFacts?: { // Нутриенты ВКБЖУ
    calories: number,
    proteins: number,
    fats: number,
    carbohydrates: number,
    weight: number
  },
  imageSource: string, // Ссылка на изображение
  availableToppings?: string[], // Доступные для добавления начинки
  excludedToppings?: string[] // Исключённые начинки для данной опции
}

// Загрузка JSON-данных
async function loadJson<T>(source: string): Promise<T> {
  const response = await fetch(source);
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

// Преобразование описания в строку (если необходимо)
function descriptionConverter(description: string | string[]): string {
  if (Array.isArray(description)) {
    return description.join(", ")
  }
  return description
}

export default function ProductPage() {

  const navigate = useNavigate();

  return <>
  </>
}