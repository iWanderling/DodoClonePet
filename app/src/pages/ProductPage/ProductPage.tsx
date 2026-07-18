import "./ProductPage.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
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

interface Ingredients {

}

export default function ProductPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const [menu, setMenu] = useState<Menu>();
  const [ingredients, setIngredients] = useState<Ingredients>();
  const [selectPanel, setSelectPanel] = useState<string>();
  const [selectedFlag, setSelectedFlag] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const fetchMenu = async () => {
      setMenu(await loadJson<Menu>("/products.json"));
      // setIngredients(await loadJson<Ingredients>("/ingredients.json"););
    };
    fetchMenu();
  }, []);

  const productID = location.pathname.split('/')[2];
  let productInfo: [keyof Menu, any] | null = null;
  let productType: keyof Menu | null = null;
  let product: any | null = null;

  if (menu) {
    productInfo = getProductInfo(menu, productID);
    if (productInfo) {
      productType = productInfo[0];
      product = productInfo[1];
    }
  }

  if (product) {
    if (!selectedFlag && product.variations) {
      let productVariations = Object.keys(product.variations);
      let variationsAmount = productVariations.length;
      if (variationsAmount > 1) {
        let chosenOption = productVariations[variationsAmount - 2];
        setDescription(chosenOption);
        setSelectedFlag(true);
        setSelectPanel(chosenOption);
        setPrice(product.variations[productVariations[variationsAmount - 2]])
      }
    }
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
                <div className="modal-card-product-panel-type">{description}</div>
                <div className="modal-card-product-panel-description">{convertDescriptionToText(product.description)}</div>
                {product.variations && <div className="button-option-panel">
                  {Object.keys(product.variations).map((key) => (
                    <button key={key}>{key} см</button>
                  ))}
                </div>
                }
                {productType === "pizzas" && <div className="button-option-panel">
                  <button>Традиционное</button>
                  <button>Тонкое</button>
                </div>}
                {/* <div className="add-ingredients-panel">
                    <h3>Добавить по вкусу</h3>
                    <div className="add-ingredients-grid">
                      {
                        ingredientsData?.[productK]?.map((ingredient, index) => (
                          <div key={index} className="add-ingredients-card">
                            <img src={ingredient.source} />
                            <span className="add-ingredients-card-title">{ingredient.title}</span>
                            <span className="add-ingredients-card-price">{ingredient.price} ₽</span>
                          </div>
                        ))
                      }
                    </div>
                  </div> */}
              </div>
              <button className="button-cart">В корзину за {price} Р</button>
            </div>
          </div>
          <button className="close-modal" onClick={() => navigate("/")}>✖</button>
        </div>
      </RemoveScroll>
    </>
  )
}