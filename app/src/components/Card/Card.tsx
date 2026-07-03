import './Card.css'
import { Link, useNavigate } from 'react-router-dom'

export default function Card({ source, title, price }: { source: string, title: string, price: number }) {

  const navigate = useNavigate();
  let product_address_title = source.split("/")[3].split(".")[0];

  return (
    <>
      <Link to={`/product/${product_address_title}`}>
        <div className="menu-card">
          <img src={source} alt={title} />
          <span>{title}</span>
          <button onClick={() => navigate(`/product/${product_address_title}`)}>от {price} ₽</button>
        </div>
      </Link>
    </>
  )
}