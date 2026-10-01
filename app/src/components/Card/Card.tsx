import './Card.css'
import { Link, useNavigate } from 'react-router-dom'


export default function Card({ id, imageSource, title, price, hasOptions, flag }:
  { id: string, imageSource: string, title: string, price: number, hasOptions: boolean, flag: string | null }) {

  const navigate = useNavigate();

  return (
    <>
      <Link to={`product/${id}`}>
        <div className="menu-card">
          {flag && <span className="menu-card-flag">{flag}</span>}
          <img src={imageSource} alt={title} />
          <span>{title}</span>
          <button onClick={() => navigate(`/product/${id}`)}>{hasOptions ? "от" : ""} {price} ₽</button>
        </div>
      </Link>
    </>
  )
}