import "./Main.css"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import Card from "../../components/Card/Card"
import { useState, useEffect } from "react";

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
  title: string,
  source: string,
  price: number
}

const MENU_SECTIONS: { id: keyof ProductsData, heading: string }[] = [
  { id: "pizzas", heading: "Пиццы" },
  { id: "combos", heading: "Комбо" },
  { id: "romes", heading: "Римские пиццы" },
  { id: "appetizers", heading: "Закуски" },
  { id: "coffee-and-tea", heading: "Кофе и чай" },
  { id: "drinks", heading: "Напитки" },
  { id: "breakfasts", heading: "Завтраки" },
  { id: "desserts", heading: "Десерты" },
]

async function get_data(source: string): Promise<ProductsData> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

function MenuSection({ id, heading, data }: { id: string, heading: string, data: Product[] }) {
  return (
    <div className="menu-content-section">
      <h1 className="menu-content-heading" id={id}>{heading}</h1>
      <div className="menu-content">
        {data.map((product, index) => (
          <Card
            key={index}
            source={product.source}
            title={product.title}
            price={product.price} />
        ))}
      </div>
    </div>
  )
}

export default function Main() {

  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<ProductsData>();

  useEffect(() => {
    const fetchMenuData = async () => {
      const data = await get_data("/data.json");
      setMenuData(data);
    };
    fetchMenuData();
  }, []);

  return (
    <>
      <main className="menu">

        <div className="menu-navbar">
          <ul>
            <li><NavLink to="#pizzas">Пиццы</NavLink></li>
            <li><NavLink to="#combos">Комбо</NavLink></li>
            <li><NavLink to="#rome">Римские пиццы</NavLink></li>
            <li><NavLink to="#snacks">Закуски</NavLink></li>
            <li><NavLink to="#coffee-and-tea">Кофе и чай</NavLink></li>
            <li><NavLink to="#drinks">Напитки</NavLink></li>
            <li><NavLink to="#breakfasts">Завтраки</NavLink></li>
            <li><NavLink to="#desserts">Десерты</NavLink></li>
            <li><button className="menu-navbar-more-button">Ещё</button></li>
          </ul>
          <button className="menu-navbar-button" onClick={() => navigate("/")}>Корзина</button>
        </div>

        <div className="menu-container">

          <div>
            {menuData && MENU_SECTIONS.map((section) => {
              const products = menuData[section.id] || [];

              return (
                <MenuSection key={section.id} heading={section.heading} id={section.id} data={products} />
              )
            })}
          </div>

          <aside className="sidebar">
            <div className="aside-img-container">
              <img src="/images/brand/aside1.webp" />
              <div className="aside-img-text-block">
                <div className="title">В приложении выгоднее</div>
                <div className="description">Скачайте и получайте бонусы</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Outlet />
    </>
  )
}
