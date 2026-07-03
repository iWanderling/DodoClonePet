import "./Navbar.css"
import logotype from "../../assets/logotype1.png"
import { NavLink, useNavigate } from "react-router-dom"

export default function Navbar() {

  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <img src={logotype} width="270px" height="40px" alt="Dodo Pizza Logo" />
        <ul>
          <li><NavLink to="/">Главная</NavLink></li>
          <li><NavLink to="/about">О нас</NavLink></li>
          <li><NavLink to="/contacts">Контакты</NavLink></li>
          <li><NavLink to="/">Акции</NavLink></li>

        </ul>
        <button className="navbar-button" onClick={() => navigate("/login")}>Войти</button>
      </nav>
    </>
  )
}