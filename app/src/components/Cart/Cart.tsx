import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector, } from "../../app/hooks"
import { selectProducts, selectTotalPrice, selectCartAmount, incrementProduct, decrementProduct } from "../../features/cartSlice"
import type { InCartProduct } from "../../types/cart"
import loadJson from '../../utils/loadJson'
import type { Menu, Product } from "../../types/menu";

// нужно понять как загружать ui данные для корзины
interface CartToShow {
  id: string,
  title: string,
  description: string,
  price: number,
  amount: number,
  imageSource: string
}

function getProduct(menu: Menu, product_id: string): Product | undefined {
  const product = menu.find(p => p.id === product_id);
  if (product) return product;
  return;
}

export default function Cart({ setIsCartOpen }: { setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [menu, setMenu] = useState<Menu>([]);
  const [inCart, setInCart] = useState<InCartProduct>();

  useEffect(() => {
    const loader = async () => setMenu(await loadJson<Menu>("/data/products.json"));
    loader();
  }, []);

  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectProducts);
  const amount = useAppSelector(selectCartAmount);
  const totalPrice = useAppSelector(selectTotalPrice);

  return (menu &&
    <div className="cart-window">
      {true &&
        <div className="cart">
          <h2>{amount} {"товар"} на {totalPrice} ₽</h2>
          {cart.map((product, index) => (getProduct(menu, product.product_id) &&
            <div key={index} className="cart-product-card">
              <div className="content">
                <img src={getProduct(menu, product.product_id).imageSource} />
                <div className="text-block">
                  <div className="title">{getProduct(menu, product.product_id).title}</div>
                  <div className="description">Описание</div>
                </div>
                <button className="remove">X</button>
              </div>
              <div className="line"></div>
              <div className="change">
                <div>
                  <span className="price">{product.price} ₽</span>
                </div>
                <a className="change-product" onClick={() => {}}>Изменить</a>
                <div className="amount-changer">
                  <button className="minus" onClick={() => dispatch(decrementProduct(product.cart_id))}>–</button>
                  <div className="amount">{product.amount}</div>
                  <button className="plus" onClick={() => dispatch(incrementProduct(product.cart_id))}>+</button>
                </div>
              </div>
            </div>
          ))}

          <div className="add-to-order">
            <h3 className="title">Добавить к заказу?</h3>
            <div className="cards">
              <div className="sauce">
                <img src="/images/1a5a6a19cf80b3fd24bf.png" />
                <div className="title">Соусы</div>
              </div>
            </div>
          </div>
          <div className="test">
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
        </div>
      }
      {false &&
        <div className="cart">
          <div className="empty">
            Пока здесь пусто!
          </div>
        </div>
      }
      <button className="close-cart-btn" onClick={() => { setIsCartOpen(false) }}>X</button>
    </div>
  )
}