import "./Main.css"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import Card from "../../components/Card/Card"
import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll"


interface ProductsData {
  "pizzas": Product[],
  "combos": Product[],
  "romes": Product[],
  "appetizers": Product[],
  "coffee-and-tea": Product[],
  "drinks": Product[],
  "breakfasts": Product[],
  "desserts": Product[],
  "sauces": Product[],
  "others": Product[]
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
  { id: "sauces", heading: "Соусы" },
  { id: "others", heading: "Другие товары" }
]

async function get_data(source: string): Promise<ProductsData> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

function MenuSection({ id, heading, data }: { id: string, heading: string, data: Product[] }) {
  return (
    <section className="menu-content-section">
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
    </section>
  )
}

export default function Main() {

  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<ProductsData>();

  useEffect(() => {
    const fetchMenuData = async () => {
      const data = await get_data("/products.json");
      setMenuData(data);
    };
    fetchMenuData();
  }, []);

  return (
    <>
      <main className="menu">
        <nav className="menu-navbar">
          <ul>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} activeClass="active" to="pizzas">Пиццы</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="combos">Комбо</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="romes">Римские пиццы</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="appetizers">Закуски</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="coffee-and-tea">Кофе и чай</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="drinks">Напитки</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="breakfasts">Завтраки</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-140} duration={200} to="desserts">Десерты</ScrollLink></li>
            <li><button className="menu-navbar-more-button">Ещё</button></li>
          </ul>
          <button className="menu-navbar-button" onClick={() => navigate("/")}>Корзина</button>
        </nav>

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
