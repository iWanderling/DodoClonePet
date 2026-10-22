import type { InCartProduct } from "../../types/cart";
import { removeProduct, decrementProduct, incrementProduct } from "../../features/cartSlice";
import { useAppDispatch } from "../../app/hooks";

// остановились здесь (работаем над открытием окна товара в корзине со всеми выбранными опциями)
export default function CartProduct({ product, index, onActiveProduct }:
  { product: InCartProduct, index: number, onActiveProduct: React.Dispatch<React.SetStateAction<string | null>> }) {
  const dispatch = useAppDispatch();


  return (
    <div key={index} className="cart-product-card">
      <div className="content">
        <img src={product.imageSource} />
        <div className="text-block">
          <div className="title">{product.title}</div>
          <div className="description">Описание</div>
        </div>
        <button className="remove" onClick={() => dispatch(removeProduct(product.cart_id))}>X</button>
      </div>
      <div className="line"></div>
      <div className="change">
        <div>
          <span className="price">{product.price} ₽</span>
        </div>
        <a className="change-product" onClick={() => onActiveProduct(product.cart_id)}>Изменить</a>
        <div className="amount-changer">
          <button className="minus" onClick={() => dispatch(decrementProduct(product.cart_id))}>–</button>
          <div className="amount">{product.amount}</div>
          <button className="plus" onClick={() => dispatch(incrementProduct(product.cart_id))}>+</button>
        </div>
      </div>
    </div>
  )
}