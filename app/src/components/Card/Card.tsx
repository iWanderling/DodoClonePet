import './Card.css'
import { Link, useNavigate } from 'react-router-dom'


export default function Card({ id, imageSource, title, price, hasOptions }:
  { id: string, imageSource: string, title: string, price: number, hasOptions: boolean }) {

  const navigate = useNavigate();

  return (
    <>
      <Link to={`product/${id}`}>
        <div className="menu-card">
          <img src={imageSource} alt={title} />
          <span>{title}</span>
          <button onClick={() => navigate(`/product/${id}`)}>{hasOptions ? "от" : ""} {price} ₽</button>
        </div>
      </Link>
    </>
  )
}