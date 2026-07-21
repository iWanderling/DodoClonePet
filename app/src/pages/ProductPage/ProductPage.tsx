import "./ProductPage.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { RemoveScroll } from "react-remove-scroll"

interface BaseProduct {
  id: string,
  title: string,
  description: string | string[],
  price?: number
}

// Record <string, number> => [20, 25, 30, 35]:number(optional)
interface PizzaCard extends BaseProduct {
  removableIngredients?: string[],
  grams: {
    traditional: Record<string, number>,
    thin: Record<string, number>,
  },
  variations: Record<string, number>,
  extraIngredients?: string[],
  excludedForThinDough?: string[]
}

interface RomeCard extends BaseProduct {
  grams: number,
  removableIngredients?: string[],
  extraIngredients?: string[]
}

interface ProductCard extends BaseProduct {
  grams: number | Record<string, number>,
  variations?: Record<string, number>
}

interface ComboCard { }

async function loadJson<T>(source: string): Promise<T> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

function getProductInfo(menu: Menu, ID: string): any {
  for (const [key, products] of Object.entries(menu))
    for (const product of products) {
      if (product.id === ID) return [key, product]
    }
  return null;
}

function convertDescriptionToText(description: string | string[]): string {
  if (Array.isArray(description)) {
    return description.join(", ")
  }
  return description;
}

interface Menu {
  ingredients: any,
  pizzas: PizzaCard,
  combos: any,
  romes: RomeCard,
  appetizers: ProductCard,
  "coffee-and-tea": ProductCard,
  drinks: ProductCard,
  desserts: ProductCard,
  breakfasts: ProductCard,
  sauces: BaseProduct,
  others: BaseProduct
}

interface BaseIngredients {
  id: string,
  title: string,
  price: number,
}

interface Ingredients {
  food: BaseIngredients[],
  drinks: BaseIngredients[]
}


export default function ProductPage() {

  const navigate = useNavigate();
  const location = useLocation();

  // Данные о меню и доп. ингредиентах для блюд и напитков
  const [menu, setMenu] = useState<Menu>();
  const [ingredients, setIngredients] = useState<Ingredients>();

  // Панели с кнопками для выбора диаметра/количества/типа и теста для пиццы
  const [selectPanel, setSelectPanel] = useState<string>();
  const [selectedFlag, setSelectedFlag] = useState<boolean>(false);
  const [selectedDough, setSelectedDough] = useState<string | null>(null);

  // Единица измерения для панели с выбором
  const um = useRef("шт");

  // Описание (граммовки, количество и т.п.), цена, доп. ингредиенты
  const [description, setDescription] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [extraIngredients, setExtraIngredients] = useState<BaseIngredients[]>([]);
  const [ingredientsType, setIngredientsType] = useState<keyof Ingredients | null>();
  const addedIngredients = useRef<any[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      setMenu(await loadJson<Menu>("/products.json"));
      setIngredients(await loadJson<Ingredients>("/ingredients.json"));
    };
    fetchMenu();
  }, []);

  // Данные о выбранном товаре
  const productID = location.pathname.split('/')[2];
  let productInfo: [keyof Menu, any] | null = null;
  let productType: keyof Menu | null = null;
  let product: any | null = null;

  // Загрузка данных о товаре
  if (menu) {
    productInfo = getProductInfo(menu, productID);
    if (productInfo) {
      productType = productInfo[0];
      product = productInfo[1];
    }
  }

  // Получаем все данные для отображения модалки
  if (product) {
    let descr = [];
    let pr = 0;
    let doughType: string | null = null;
    let chosenOption = "1";

    if (!selectedFlag) {
      if (product.variations) {
        let productVariations = Object.keys(product.variations);
        let variationsAmount = productVariations.length;
        chosenOption = productVariations[0];
        pr = product.variations[chosenOption]

        if (variationsAmount > 1) {
          chosenOption = productVariations[variationsAmount - 2];
          pr = product.variations[productVariations[variationsAmount - 2]];
        }
      }
      else {
        pr = product.price;
      }

      if (productType === "pizzas") {
        um.current = "см";
        descr.push(chosenOption + " см");
        if (selectedDough) descr.push(selectedDough);
        else {
          doughType = "традиционное тесто";
          descr.push("традиционное тесто");
        }
      }
      else if (productType === "romes") {
        um.current = "см";
        doughType = "римское тесто";
        descr.push(chosenOption + " см");
        descr.push(doughType);
      }
      else if (productType === "drinks" || productType === "coffee-and-tea") {
        um.current = "л";
        descr.push(chosenOption + " л");
      }
      else descr.push(chosenOption + " шт");

      if (product.grams) {
        if (typeof product.grams === "number") descr.push(product.grams + " г");
        else if (productType === "pizzas") {
          if (doughType === "традиционное тесто") descr.push(product.grams["traditional"][chosenOption] + " г");
          else if (doughType === "тонкое тесто") descr.push(product.grams["thin"][chosenOption] + " г")
        }
        else descr.push(product.grams[chosenOption] + " г");
      }

      setSelectedFlag(true);
      setSelectPanel(chosenOption);
      setSelectedDough(doughType);
      setDescription(descr);
      setPrice(pr);
    }
  }

  useEffect(() => {
    let ingredientsType1: keyof Ingredients | null = null;
    if (product && product.extraIngredients) {
      let extrIngr = [];
      console.log(productType);
      if (productType && ["pizzas", "romes"].includes(productType)) ingredientsType1 = "food";
      else if (productType && ["coffee-and-tea", "drinks"].includes(productType)) ingredientsType1 = "drinks";

      console.log(productType, ingredientsType1);
      if (ingredients && ingredientsType1) {

        for (let ei of product.extraIngredients) {
          for (let i of ingredients[ingredientsType1]) {
            if (ei === i.id) extrIngr.push(i);
          }
        }
      }

      setExtraIngredients(extrIngr);
      setIngredientsType(ingredientsType1);
    }
  }, [ingredients]);

  if (productType === "coffee-and-tea") productType = "drinks";

  function changePriceWithIngredients(ingredient: BaseIngredients): void {
    let ingredientPrice = ingredient.price;

    if (!addedIngredients.current.includes(ingredient.id)) {
      addedIngredients.current.push(ingredient.id);
    } else {
      addedIngredients.current = addedIngredients.current.filter(i => i !== ingredient.id);
      ingredientPrice = -ingredientPrice;
    }

    setPrice((prev) => prev + ingredientPrice)
  }

  return (product &&
    <>
      <RemoveScroll>
        <div className="modal-product-page">
          <div className="modal-card">
            <img className="modal-card-product-img" src={`/images/${productType}/${product.id}.webp`} alt="" />
            <div className="modal-card-product-panel">
              <div className="modal-card-product-content">
                <h2>{product.title}</h2>
                <div className="modal-card-product-panel-type">{description.join(", ")}</div>
                <div className="modal-card-product-panel-description">{convertDescriptionToText(product.description)}</div>
                {product.variations && <div className="button-option-panel">
                  {Object.keys(product.variations).map((key) => (
                    (key === selectPanel && Object.keys(product.variations).length > 1 ?
                      <button className="active" key={key}>{key} {um.current}</button> :
                      <button key={key} onClick={() => setSelectPanel(key)} >{key} {um.current}</button>
                    )
                  ))}
                </div>
                }
                {productType === "pizzas" && <div className="button-option-panel">
                  <button className={selectedDough === "традиционное тесто" ? "active" : ""}
                    onClick={() => setSelectedDough("традиционное тесто")}>Традиционное</button>
                  <button className={selectedDough === "тонкое тесто" ? "active" : ""}
                    onClick={() => setSelectedDough("тонкое тесто")}>Тонкое</button>
                </div>
                }
                {productType === "romes" && <div className="button-option-panel">
                  <button>Римское тесто</button>
                  </div>
                  }
                {extraIngredients.length > 0 &&
                  <div className="add-ingredients-panel">
                    <h3>Добавить по вкусу</h3>
                    <div className="add-ingredients-grid">
                      {
                        extraIngredients.map((ingredient, index) => (
                          <button key={index} className={`add-ingredients-card ${addedIngredients.current.includes(ingredient.id) ? "active" : "Ingre"}`} onClick={() => {changePriceWithIngredients(ingredient)}}>
                            <img src={`/images/ingredients/${ingredientsType}/${ingredient.id}.png`} />
                            <span className="add-ingredients-card-title">{ingredient.title}</span>
                            <span className="add-ingredients-card-price">{ingredient.price} ₽</span>
                          </button>
                        ))
                      }
                    </div>
                  </div>}
              </div>
              <button className="button-cart">В корзину за {price} Р</button>
            </div>
          </div>
          <button className="close-modal" onClick={() => navigate("/")}>✖</button>
        </div>
      </RemoveScroll >
    </>
  )
}