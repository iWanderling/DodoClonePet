import "./ProductPage.css"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { RemoveScroll } from "react-remove-scroll"


// Тип для меню (повторяет Product)
type Menu = Product[];
type Toppings = ProductToppings[];

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

// Описание топпингов
type ProductToppings = {
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

// Загрузка JSON-данных
async function loadJson<T>(source: string): Promise<T> {
  const response = await fetch(source);
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
};

// Преобразование описания в строку (если необходимо)
function descriptionConverter(description: string | string[]): string {
  if (Array.isArray(description)) {
    return description.join(", ")
  }
  return description
};

export default function ProductPage() {

  // Для навигации и ID товара
  const navigate = useNavigate();
  const productID = useParams()["product"];

  // Хранение списка опций товара и доступных топпингов для него
  const [product, setProduct] = useState<Product>();
  const productOptions = useRef<ProductOptions[]>([]);
  const [productToppings, setProductToppings] = useState<ProductToppings>();

  // Состояния типа товара и его размера/количества
  const [kind, setKind] = useState<string>();
  const [size, setSize] = useState<string>();

  // Загрузка данных о товаре и !топпингах(добавить)
  useEffect(() => {
    const loader = async () => {
      const menu = await loadJson<Menu>("/products.json");
      const toppings = await loadJson<Toppings>("/toppings.json");

      setProduct(menu.find(p => p.id === productID));
    };
    loader();
  }, []);

  console.log(product);

  return (product &&
    <RemoveScroll>
      <div className="modal-product-page">
        <div className="modal-card">
        </div>

        <button className="close-modal" onClick={() => navigate("/")}>✖</button>
      </div>
    </RemoveScroll>
  )
}