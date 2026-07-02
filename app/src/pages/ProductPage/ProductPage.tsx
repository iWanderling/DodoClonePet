import "./ProductPage.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

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

async function get_data(source: string): Promise<ProductsData> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

export default function ProductPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const [menuData, setMenuData] = useState<Product[]>();

  useEffect(() => {
    const fetchMenuData = async () => {
      const data = await get_data("/data.json");
      setMenuData(Object.values(data).flat());
    };
    fetchMenuData();
  }, []);

  console.log(menuData);
  const slug = location.pathname.split('/')[2];
  let dataset: Product = { slug: "", title: "", source: "", price: 0 };

  if (menuData) {
    for (let product of menuData) {
      if (product.slug === slug) {
        dataset = product;
        break;
      }
    }
  }

  return (

    <>
      <div className="modal-product-page">
        <div className="modal-card">
          <img className="modal-card-product-img" src={dataset.source} alt="" />
          <div className="modal-card-product-panel">
            <h2>{dataset.title}</h2>
            <div className="modal-card-product-panel-type">25 см, традиционное тесто 25, 380 г</div>
            <div className="modal-card-product-panel-description">Увеличенная порция моцареллы, ветчина , пикантная пепперони , кубики брынзы , томаты , шампиньоны , итальянские травы , фирменный томатный соус</div>
            <div className="button-option-panel">
              <a>25 см</a>
              <a>30 см</a>
              <a>35 см</a>
            </div>
            <div className="button-option-panel">
              <a>Традиционное</a>
              <a>Тонкое</a>
            </div>

            <div className="add-ingredients-panel">
              <h3>Добавить по вкусу</h3>
              <div className="add-ingredients-grid">
                <div className="add-ingredients-card">
                  <img src="/images/ingredients/mozarella.png" />
                  <span className="add-ingredients-card-title">Моцарелла</span>
                  <span className="add-ingredients-card-price">149 Р</span>
                </div>
                <div className="add-ingredients-card">
                  <img src="/images/ingredients/mozarella.png" />
                  <span className="add-ingredients-card-title">Моцарелла</span>
                  <span className="add-ingredients-card-price">149 Р</span>
                </div>
                <div className="add-ingredients-card">
                  <img src="/images/ingredients/mozarella.png" />
                  <span className="add-ingredients-card-title">Моцарелла</span>
                  <span className="add-ingredients-card-price">149 Р</span>
                </div>
                <div className="add-ingredients-card">
                  <img src="/images/ingredients/mozarella.png" />
                  <span className="add-ingredients-card-title">Моцарелла</span>
                  <span className="add-ingredients-card-price">149 Р</span>
                </div>
                <div className="add-ingredients-card">
                  <img src="/images/ingredients/mozarella.png" />
                  <span className="add-ingredients-card-title">Моцарелла</span>
                  <span className="add-ingredients-card-price">149 Р</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="close-modal" onClick={() => navigate("/")}>✖</button>
      </div>
    </>
  )
}