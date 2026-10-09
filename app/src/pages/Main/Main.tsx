import "./Main.css"
import { Outlet, useNavigate } from "react-router-dom"
import Stories from "../../components/Stories/Stories"
import MenuSection from "../../components/MenuSection/MenuSection";
import { useState, useEffect } from "react";
import { Link } from "react-scroll";

// Тип для меню (повторяет Product)
type Menu = Product[];

// Универсальное описание для каждого товара
export interface Product {
  id: string, // ID
  title: string, // Название
  type: string, // Тип товара (пицца, закуска, напиток)
  inMenu: string[], // В каких разделах меню находится
  description: string | string[], // Описание товара
  isOptionalDescription: boolean, // Можно ли удалять ингредиенты из описания
  removableOptionalDescription?: string[], // Какие ингредиенты можно удалять из описания
  options: ProductOptions[], // Опции для товара (по размеру, количеству, типу и так далее)
  measurement_unit: string, // Мера исчисления (в граммах, милилитрах, поштучно)
  flag: string | null, // Флаг для плашки в меню (суперхит, скидка и так далее)
}

// Описание опций для каждого товара
type ProductOptions = {
  kind: string, // Тип (виды теста, закусок или одиночный тип)
  price: number, // Цена
  size: number, // Количество или размер
  nutritionFacts?: { // Нутриенты ВКБЖУ
    calories: number,
    proteins: number,
    fats: number,
    carbohydrates: number,
    weight: number
  },
  imageSource: string, // Ссылка на изображение
  availableToppings?: string[], // Доступные для добавления начинки
  excludedToppings?: string[] // Исключённые начинки для данной опции
}

// Данные о разделах основного меню
const MENU_SECTIONS = [
  { id: "pizza", heading: "Пиццы" },
  // { id: "combo", heading: "Комбо" },
  { id: "roman", heading: "Римские пиццы" },
  { id: "appetizer", heading: "Закуски" },
  { id: "coffee-tea", heading: "Кофе и чай" },
  { id: "drink", heading: "Напитки" },
  { id: "breakfast", heading: "Завтраки" },
  { id: "dessert", heading: "Десерты" },
  { id: "sauce", heading: "Соусы" },
  { id: "other", heading: "Другие товары" }
]

// Загрузка JSON
async function loadJson<T>(source: string): Promise<T> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}

// Компонент главного окна сайта
export default function Main() {

  // Создание состояний и загрузка данных меню
  const navigate = useNavigate();
  const [menu, setMenu] = useState<Menu>();

  // Состояния отображения выпадающей навпанели
  const [navbarDisplayed, setNavbarDisplayed] = useState<{ id: string, heading: string }[]>([]);
  const [navbarDropdown, setNavbarDropdown] = useState<{ id: string, heading: string }[]>([]);

  // Состояния выпадающей навпанели
  const [activeSection, setActiveSection] = useState<string>("more");
  const [isDropdownHovered, setIsDropdownHovered] = useState<boolean>(false);
  const dropdownTitle = "Ещё";

  // Загрузка меню и секций для навигационной панели
  useEffect(() => {
    const loader = async () => {
      setMenu(await loadJson<Menu>("/data/products.json"));
    };
    loader();
    if (MENU_SECTIONS.length >= 7) {
      setNavbarDisplayed(MENU_SECTIONS.slice(0, 6));
      setNavbarDropdown(MENU_SECTIONS.slice(6));
    }
    else setNavbarDisplayed(MENU_SECTIONS);
  }, []);

  return (
    <>
      {/* Панель с названием и выбранным городом */}
      <nav className="header-panel">
        <div className="left">
          <div className="header-panel-brand-block">
            <img className="header-panel-img" src="/images/dodologo.webp" />
            <div className="header-panel-img-text">
              <div className="title">НЕ додо пицца</div>
              <div className="description">1111 пиццерии в 111 странах</div>
            </div>
          </div>
          <div className="header-panel-city-info">
            <div>Доставка пиццы <a className="city">Казань</a></div>
            <div>35 мин • 4.89 ⭐ </div>
          </div>
        </div>
        <div className="right">
          <button className="menu-navbar-button" onClick={() => navigate("/")}>Корзина</button>
          <button className="header-panel-btn">Войти</button>
        </div>
      </nav>

      <Stories />

      {/* Раздел с навигационной панелью меню */}
      <nav className="menu-navbar">
        <div className="menu-navbar-block">
          <ul>
            {/* Основная навпанель */}
            {menu && navbarDisplayed.map((section) => {
              return (
                <li key={section.id}>
                  <Link offset={-180} to={section.id} className={activeSection === section.id ? "active" : ""}>
                    {section.heading}
                  </Link>
                </li>
              )
            })}
            {/* Выпадающее меню */}
            {menu && navbarDropdown &&
              <li key={activeSection}
                onMouseEnter={() => { setTimeout(() => setIsDropdownHovered(true), 100) }}
                onMouseLeave={() => { setTimeout(() => setIsDropdownHovered(false), 100) }}>
                <a className={navbarDropdown.find(section => section.id === activeSection) ? "active" : ""}>
                  {navbarDropdown.find(section => section.id === activeSection) ?
                    navbarDropdown.find(section => section.id === activeSection)?.heading : dropdownTitle}
                </a>
                <div className={`menu-navbar-dropdown ${isDropdownHovered ? "visible" : "hidden"}`}>
                  <ul>
                    {navbarDropdown.map((section) => {
                      return (
                        <li key={section.id}><Link className={section.id === activeSection ? "active" : ""} offset={-180} to={section.id}>{section.heading}</Link></li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            }
          </ul>
        </div>
      </nav >

      {/* Раздел с меню */}
      <main className="menu" >
        <section className="popular-products-block">
          <button className="popular-products-card">
            <img src="/images/019a8aaa69cc7601b28736b1ebe7fc25.webp" />
            <span className="popular-products-card-title">Песто</span>
            <button className="popular-products-card-price-btn">245 ₽</button>
          </button>
        </section>
        <div className="menu-container">
          <div>
            {menu && MENU_SECTIONS.map((section) => {
              return (
                <MenuSection key={section.id} heading={section.heading} type={section.id} menu={menu} setActiveSection={setActiveSection} />
              )
            })}
          </div>
          <aside className="sidebar">
            <div className="aside-img-container">
              <img src="images/c8d4e73f9a1b6c5e0f2a4b8d7e9f1c3a.webp" />
              <div className="aside-img-text-block">
                <div className="title">В приложении выгоднее</div>
                <div className="description">Скачайте и получайте бонусы</div>
              </div>
            </div>
          </aside>
        </div>
        <section className="delivery">
          <h1>Доставка пиццы в Казани</h1>
          <div className="delivery-content-block">
            <div className="delivery-zone">
              <h3>ЗОНА ДОСТАВКИ ОГРАНИЧЕНА</h3>
              <div className="delivery-zone-container">
                <img src="/images/911e3a5bc67fc765b604.jpg" />
                <h4 className="delivery-zone-img-title">Зона доставки</h4>
              </div>
            </div>
            <div className="delivery-info">
              <h3>От 649 ₽</h3>
              <p>Минимальная сумма доставки</p>
              <h3>5 000 ₽</h3>
              <p>Максимальная сумма при оплате наличными</p>
              <p>Все цены в меню указаны без учета скидок</p>
              <p>Изображения продуктов могут отличаться от продуктов в заказе.</p>
            </div>
          </div>
        </section>
      </main>
      < Outlet />
    </>
  )
}