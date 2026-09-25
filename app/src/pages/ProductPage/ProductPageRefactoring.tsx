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
  defaultKind: string,  // Тип товара по умолчанию
  defaultSize: number, // Размер / количество по умолчанию
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
    proteins?: number,
    fats?: number,
    carbohydrates?: number,
    weight?: number
  },
  imageSource: string, // Ссылка на изображение
  availableToppings?: string[], // Доступные для добавления начинки
  excludedToppings?: string[] // Исключённые начинки для данной опции
  toppingSize?: keyof ProductToppings["prices"]; // Размер начинки (для изменения цены)
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

// Найти опцию товара по выбранному размеру/количеству и типу
function optionFinder(product: Product, size: number, kind: string): ProductOptions | undefined {
  return product.options.find(option => (option.size === size && option.kind === kind))
}

// Сделать строку с заглавной буквы
function toCapitalize(string: string) {
  if (!string) return "";
  return string[0].toUpperCase() + string.slice(1);
}

export default function ProductPage() {

  // Для навигации и ID товара
  const navigate = useNavigate();
  const productID = useParams()["product"];

  // Хранение списка опций товара и доступных топпингов для него
  const [product, setProduct] = useState<Product>();
  const [currentOption, setCurrentOption] = useState<ProductOptions>();
  const [productToppings, setProductToppings] = useState<Toppings>();
  const [allToppings, setAllToppings] = useState<Toppings>();
  const [selectedToppings, setSelectedToppings] = useState<Toppings>([]);
  const [translator, setTranslator] = useState<any>();

  // Состояния типа товара и его размера/количества
  const [allKinds, setAllKinds] = useState<string[]>();
  const [disabledKinds, setDisabledKinds] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<number[]>();

  const [kind, setKind] = useState<string>();
  const [size, setSize] = useState<number>();

  // Загрузка данных о товаре и топпингах (добавить)
  useEffect(() => {
    const loader = async () => {
      const menu = await loadJson<Menu>("/data/products.json");
      const toppings = await loadJson<Toppings>("/data/toppings.json");
      const translator = await loadJson<any>("/data/translator.json");

      setProduct(menu.find(p => p.id === productID));
      setAllToppings(toppings);
      setTranslator(translator);
    };
    loader();
  }, []);

  // Загрузка всех опций выбора размера и типа товара, 
  // его начинок, установка варианта по умолчанию
  useEffect(() => {
    if (product) {
      let sizes: Set<number> = new Set(product.options.map(option => option.size));
      let sortedSizes: number[] = [...sizes].sort((a, b) => a - b);
      setAllSizes(sortedSizes);

      let kinds: Set<string> = new Set(product.options.map(option => option.kind));
      let sortedKinds: string[] = [...kinds].sort();
      setAllKinds(sortedKinds);

      setSize(product.defaultSize);
      setKind(product.defaultKind);

      if (size && kind) setCurrentOption(optionFinder(product, size, kind));
      if (allToppings && currentOption && currentOption.availableToppings) {
        let toppings: ProductToppings[] = [];

        for (let topping_id of currentOption.availableToppings) {
          let topping = allToppings.find((t) => t.id === topping_id);
          if (topping) toppings.push(topping);
        }
        setProductToppings(toppings);
      }
    }
  }, [product, allToppings]);

  // Изменение размера и типа товара
  useEffect(() => {
    if (currentOption) {
      setKind(currentOption.kind);
      setSize(currentOption.size);
    }
    if (allToppings && currentOption && currentOption.availableToppings) {
      let toppings: ProductToppings[] = [];

      for (let topping_id of currentOption.availableToppings) {
        let topping = allToppings.find((t) => t.id === topping_id);
        if (topping) toppings.push(topping);
      }
      setProductToppings(toppings);
    }
    else setProductToppings([]);
  }, [currentOption]);

  // Установка новой выбранной опции
  useEffect(() => {
    if (product && size && kind) {
      let notAvailableKinds: string[] = [];
      let foundOption = optionFinder(product, size, kind);

      if (foundOption) setCurrentOption(foundOption);

      if (allKinds) {
        for (let k of allKinds) {
          let randomOption = optionFinder(product, size, k);
          if (!randomOption) notAvailableKinds.push(k);
          else if (!foundOption) setCurrentOption(randomOption);
        }
      }

      setDisabledKinds(notAvailableKinds);
    }
  }, [size, kind]);

  // HTML
  return (product && currentOption &&
    <RemoveScroll>
      <div className="modal-product-page">
        <div className="modal-card">
          <img className="modal-card-product-img" src={currentOption.imageSource} alt={product.title} />
          <div className="modal-card-product-panel">
            <div className="modal-card-product-content">
              <h2>{product.title}</h2>
              <div className="modal-card-product-panel-type">
                {currentOption.size} {translator[product.measurement_unit]}
                {currentOption.kind != "single" ? ", " + translator[currentOption.kind] : ""}
                {currentOption.nutritionFacts?.weight ? ", " + currentOption.nutritionFacts.weight + " " + translator["g"] : ""}

              </div>
              <div className="modal-card-product-panel-description">{toCapitalize(descriptionConverter(product.description))}</div>
              {size && allSizes &&
                <div className="button-option-panel">
                  {allSizes.map((s) => (
                    <button className={(s === size && allSizes.length > 1) ? "active" : ""}
                      key={s} onClick={() => setSize(s)} >{s} {translator[product.measurement_unit]}</button>
                  ))}
                </div>
              }
              {kind && allKinds && allKinds[0] != "single" &&
                <div className="button-option-panel">
                  {allKinds.map((k) => (
                    <button className={(disabledKinds.find(dk => k === dk)) ? "disabled" : (k === kind && allKinds.length > 1) ? "active" : ""}
                      key={k} onClick={(disabledKinds.find(dk => k === dk)) ? () => { } : () => setKind(k)}>
                      {toCapitalize(translator[k])}
                    </button>
                  ))}
                </div>
              }
              {productToppings && productToppings.length > 0 &&
                <div className="add-ingredients-panel">
                  <h3>Добавить по вкусу</h3>
                  <div className="add-ingredients-grid">
                    {
                      productToppings.map((topping, index) => (
                        <button key={index}
                          className={`add-ingredients-card ${selectedToppings && selectedToppings.find((t) => t === topping) ? "active" : ""}`}
                          onClick={() => {
                            setSelectedToppings((prev) => prev.includes(topping) ?
                              prev.filter((t) => t !== topping) :
                              [...prev, topping])
                          }}>
                          <img src={topping.imageSource} />
                          <span className="add-ingredients-card-title">{topping.title}</span>
                          <span className="add-ingredients-card-price">
                            {(currentOption.toppingSize) ? topping.prices[currentOption.toppingSize] : topping.prices["tiny"]} ₽</span>
                        </button>)
                      )
                    }
                  </div>
                </div>
              }
            </div>
            <button className="button-cart">В корзину за {(!currentOption.toppingSize) ? currentOption.price :
            currentOption.price + selectedToppings.reduce
              ((sum, topping) => sum + ((currentOption.toppingSize && currentOption.availableToppings?.includes(topping.id)) ? topping.prices[currentOption.toppingSize] : 0), 0)} Р</button>
          </div>
        </div>

        <button className="close-modal" onClick={() => navigate("/")}>✖</button>
      </div>
    </RemoveScroll >
  )
}