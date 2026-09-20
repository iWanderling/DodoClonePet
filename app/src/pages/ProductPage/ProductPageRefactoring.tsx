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
  const [currentOption, setCurrentOption] = useState<ProductOptions>();
  const [productToppings, setProductToppings] = useState<ProductToppings>();

  // Состояния типа товара и его размера/количества
  const [allKinds, setAllKinds] = useState<Set<string>>();
  const [allSizes, setAllSizes] = useState<Set<number>>();

  const [kind, setKind] = useState<string>();
  const [size, setSize] = useState<number>();

  // Загрузка данных о товаре и топпингах (добавить)
  useEffect(() => {
    const loader = async () => {
      const menu = await loadJson<Menu>("/data/products.json");
      const toppings = await loadJson<Toppings>("/data/toppings.json");

      setProduct(menu.find(p => p.id === productID));
    };
    loader();
  }, []);

  // Загрузка текущей опции товара
  useEffect(() => {
    if (product) {
      let sizes: Set<number> = new Set(product.options.map(option => option.size));
      let sortedSizes: number[] = [...sizes].sort((a, b) => a - b); // finished here

      setCurrentOption(product.options[product.options.length - 1]);
    }
    if (currentOption) {
      setKind(currentOption.kind);
      setSize(currentOption.size);
    }
  }, [product])

  return (product && currentOption &&
    <RemoveScroll>
      <div className="modal-product-page">
        <div className="modal-card">
          <img className="modal-card-product-img" src={currentOption.imageSource} alt={product.title} />
          <div className="modal-card-product-panel">
            <div className="modal-card-product-content">
              <h2>{product.title}</h2>
              <div className="modal-card-product-panel-type">{descriptionConverter(product.description)}</div>
              {size &&
                <div className="button-option-panel">
                  {product.options.map((option) => (
                    <button className={option.size === size ? "active" : ""}
                      key={size}>{option.size}{product.measurement_unit}</button>
                  ))}
                </div>
              }
              {kind &&
                <div className="button-option-panel">
                  {product.options.map((option) => (
                    <button className={option.kind === kind ? "active" : ""}
                      key={kind}>{option.kind}</button>
                  ))}
                </div>
              }
            </div>
            <button className="button-cart">В корзину за {currentOption.price} Р</button>
          </div>
        </div>

        <button className="close-modal" onClick={() => navigate("/")}>✖</button>
      </div>
    </RemoveScroll>
  )
}