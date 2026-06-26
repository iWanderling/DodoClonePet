import "./Main.css"
import { NavLink, useNavigate } from "react-router-dom"
// import pepperoni from "../../assets/pepperoni.webp"


export default function Main() {

  const navigate = useNavigate();

  return (
    <>
      <main className="menu">
        <div className="menu-navbar">
          <ul>
            <li><NavLink to="#pizzas">Пиццы</NavLink></li>
            <li><NavLink to="#snacks">Закуски</NavLink></li>
            <li><NavLink to="#desserts">Десерты</NavLink></li>
            <li><NavLink to="#drinks">Напитки</NavLink></li>
            <li><button className="menu-navbar-more-button">Ещё</button></li>
          </ul>

          <button className="menu-navbar-button" onClick={() => navigate("/")}>Корзина</button>
        </div>

        {/* <img src={pepperoni}></img> */}
      </main>
    </>
  )
}