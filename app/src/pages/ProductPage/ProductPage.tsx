import "./ProductPage.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { RemoveScroll } from "react-remove-scroll"

interface ProductsData {
  "pizzas": Product[],
  "combos": Product[],
  "romes": Product[],
  "appetizers": Product[],
  "coffee-and-tea": Product[],
  "drinks": Product[],
  "breakfasts": Product[],
  "desserts": Product[]
}

interface Product {
  slug: string,
  title: string,
  source: string,
  price: number
}

interface IngredientsData {
  "food": Ingredient[],
  "drink": Ingredient[]
}

interface Ingredient {
  title: string,
  source: string,
  price: number
}

async function get_data<T>(source: string): Promise<T> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

export default function ProductPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const [menuData, setMenuData] = useState<ProductsData>();
  const [ingredientsData, setIngredientsData] = useState<IngredientsData>();

  useEffect(() => {
    const fetchMenuData = async () => {
      const products = await get_data<ProductsData>("/products.json");
      setMenuData(products);

      const ingredients = await get_data<IngredientsData>("/ingredients.json");
      setIngredientsData(ingredients);

    };
    fetchMenuData();
  }, []);

  const slug = location.pathname.split('/')[2];
  let dataset: Product = { slug: "", title: "", source: "", price: 0 };
  let productT: keyof ProductsData = "pizzas";
  let productK: keyof IngredientsData;

  function isProductKey(key: string, obj: ProductsData): key is keyof ProductsData {
    return (key in obj);
  }

  if (menuData) {
    let flag = false;
    for (let [productType, datas] of Object.entries(menuData)) {
      if (isProductKey(productType, menuData)) {
        for (let product of datas) {
          if ((product.slug === slug)) {
            dataset = product;
            productT = productType;
            flag = true;
            break;
          }
        }
      }
      if (flag) break;
    }
  }

  productK = ["pizzas", "romes"].includes(productT) ? "food" : "drink";

  console.log(productT, productK);

  return (
    <>
      <RemoveScroll>
        <div className="modal-product-page">
          <div className="modal-card">
            <img className="modal-card-product-img" src={dataset.source} alt="" />
            <div className="modal-card-product-panel">
              <div className="modal-card-product-content">
                <h2>{dataset.title}</h2>
                <div className="modal-card-product-panel-type">Здесь будут граммовки и количество</div>
                <div className="modal-card-product-panel-description">Здесь будет описание продукта</div>
                <div className="button-option-panel">
                  <button>25 см</button>
                  <button>30 см</button>
                  <button>35 см</button>
                </div>
                <div className="button-option-panel">
                  <button>Традиционное</button>
                  <button>Тонкое</button>
                </div>
                <div className="add-ingredients-panel">
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
                </div>
              </div>
              <button className="button-cart">В корзину за 615 Р</button>
            </div>
          </div>
          <button className="close-modal" onClick={() => navigate("/")}>✖</button>
        </div>
      </RemoveScroll>
    </>
  )
}