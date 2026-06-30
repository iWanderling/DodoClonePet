import "./Main.css"
import { NavLink, useNavigate } from "react-router-dom"
import Card from "../../components/Card/Card"
import { useState, useEffect } from "react";


interface Product {
  title: string,
  source: string,
  price: number
}


async function get_data(source: string): Promise<Product[]> {
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
  const [pizzas, setPizzas] = useState<Product[]>([]);

  useEffect(() => {
    const fetchPizzas = async () => {
      const data = await get_data("/data.json");
      setPizzas(data);
      console.log(data);
    };
    fetchPizzas();
  }, [])

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
            <MenuSection heading="Пиццы" id={"pizzas"} data={pizzas} />
            <MenuSection heading="Комбо" id={"combos"} data={pizzas} />
            <MenuSection heading="Римские пиццы" id={"rome"} data={pizzas} />
            <MenuSection heading="Закуски" id={"snacks"} data={pizzas} />
            <MenuSection heading="Кофе и чай" id={"coffee-and-tea"} data={pizzas} />
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
    </>
  )
}
