import "./Navbar.css"
import logotype from "../../assets/logotype1.png"
import { NavLink, useNavigate } from "react-router-dom"

export default function Navbar() {

  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <ul>
          <li><NavLink className="live" to="/">Прямой эфир</NavLink></li>
          <li><NavLink to="/about">Работа в Додо</NavLink></li>
          <li><NavLink to="/contacts">О нас</NavLink></li>
          <li><NavLink to="/">Контакты</NavLink></li>
          <li><NavLink to="/">Корпоративные заказы</NavLink></li>
          <li><NavLink to="/about">Сертификаты для бизнеса</NavLink></li>
          <li><NavLink to="/contacts">Акции</NavLink></li>
          <li><NavLink to="/">Додокоины</NavLink></li>
        </ul>
        Язык
      </nav>
    </>
  )
}