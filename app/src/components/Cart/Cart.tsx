import { useEffect, useState } from "react";
import "./Cart.css";
import { useAppDispatch, useAppSelector, } from "../../app/hooks"
import { selectProducts, selectTotalPrice, selectCartAmount } from "../../features/cartSlice"
import { getMenuAsync, selectMenu } from "../../features/menuSlice";
import CartProduct from "./CartProduct"
import type { InCartProduct } from "../../types/cart";
import ProductPage from "../../pages/ProductPage/ProductPage";

export default function Cart({ setIsCartOpen }: { setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);

  const cart = useAppSelector(selectProducts);
  const amount = useAppSelector(selectCartAmount);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [activeProduct, setActiveProduct] = useState<InCartProduct["cart_id"] | null>(null);

  useEffect(() => {
    dispatch(getMenuAsync());
  }, []);

  return (menu &&
    <div className="cart-window">
      {(cart.length > 0) &&
        <div className="cart">
          <h2>{amount} {"товар"} на {totalPrice} ₽</h2>
          {cart.map((product, index) =>
            <CartProduct key={index} product={product} index={index} onActiveProduct={setActiveProduct} />
          )}
          <div className="add-to-order">
            <h3 className="title">Добавить к заказу?</h3>
            <div className="cards">
              <div className="sauce">
                <img src="/images/1a5a6a19cf80b3fd24bf.png" />
                <div className="title">Соусы</div>
              </div>
            </div>
          </div>

          <div className="data-block">
            <div className="promocode">
              <label className="promocode-label">
                <input placeholder="Промокод" />
                <a>Применить</a>
              </label>
            </div>
            <div className="line"></div>
            <div className="data-prices">
              <div className="data-info">
                <span>{amount} товара</span>
                <span>{totalPrice} ₽</span>
              </div>
              <div className="data-info">
                <span>Начислим додокоины</span>
                <span>+{Math.round(totalPrice * 0.05)} D</span>
              </div>
            </div>
            <div className="line"></div>
            <div className="total-price">
              <span>Сумма заказа</span>
              <span>{amount} ₽</span>
            </div>
          </div>
          <div className="create-order">
            <button>К оформлению заказа</button>
          </div>
        </div>

      }
      {activeProduct &&
        <ProductPage activeProductID={activeProduct} setActiveProductID={setActiveProduct} />
      }
      {!cart.length &&
        <div className="cart">
          <div className="empty">
            <div>
            <img src="images/9e51eaf40b5dd1d897e5.png" />
            </div>
            <div className="empty-text">
              <p className="t">Пока тут пусто</p>
              <p className="s1">Добавьте пиццу. Или две!</p>
              <p className="s2">А мы доставим ваш заказ от 649 ₽</p>
            </div>
            
          </div>
        </div>
      }
      <button className="close-cart-btn" onClick={() => { setIsCartOpen(false) }}>X</button>
    </div>
  )
}