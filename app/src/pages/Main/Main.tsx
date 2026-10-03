import "./Main.css"
import { Outlet, useNavigate } from "react-router-dom"
import Card from "../../components/Card/Card"
import { useState, useEffect, useRef } from "react";
import { Link as ScrollLink } from "react-scroll"

// Тип для меню (повторяет Product)
type Menu = Product[];

// Универсальное описание для каждого товара
interface Product {
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

// Тип данных для вывода товаров из определённого раздела меню
interface MenuSectionOutputData {
  id: string,
  title: string,
  imageSource: string,
  price: number,
  hasOptions: boolean,
  flag: string | null
}

// Данные о разделах основного меню
const MENU_SECTIONS = [
  { id: "pizza", heading: "Пиццы" },
  { id: "combo", heading: "Комбо" },
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

// Создание разделов для меню
function MenuSection({ heading, type, menu }: { heading: string, type: string, menu: Menu }) {

  const sectionProducts: Product[] = menu.filter(p => p.type === type);
  const outputData: MenuSectionOutputData[] = [];

  // Подготовка данных о товарах к выводу
  for (let sectionProduct of sectionProducts) {
    let productID = sectionProduct.id;
    let productTitle = sectionProduct.title;
    let productImageSource: string;
    let productPrice: number;
    let hasOptions = false;
    let flag = sectionProduct.flag;

    let indexToFindImgPrice = 0;

    if (sectionProduct.options.length > 1) {
      indexToFindImgPrice = 1;
      hasOptions = true;
    }

    productImageSource = sectionProduct.options[indexToFindImgPrice].imageSource;
    productPrice = sectionProduct.options[0].price; // отредактировать (минимальная цена);

    // Подготовленные данные о товаре
    let productData: MenuSectionOutputData = {
      id: productID,
      title: productTitle,
      imageSource: productImageSource,
      price: productPrice,
      hasOptions: hasOptions,
      flag: flag
    }

    outputData.push(productData);
  }

  return (
    <section className="menu-content-section" id={type}>
      <h1 className="menu-content-heading">{heading}</h1>
      <div className="menu-content">
        {outputData.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            imageSource={product.imageSource}
            title={product.title}
            price={product.price}
            hasOptions={product.hasOptions}
            flag={product.flag}
          />
        ))}
      </div>
    </section>
  )
}

// Компонент главного окна сайта
export default function Main() {

  // Создание состояний и загрузка данных меню
  const navigate = useNavigate();
  const [menu, setMenu] = useState<Menu>();
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const [navbarDisplayed, setNavbarDisplayed] = useState<{ id: string, heading: string }[]>([]);
  const [navbarDropdown, setNavbarDropdown] = useState<{ id: string, heading: string }[]>([]);
  const [moreBtnId, setMoreBtnId] = useState<string>("more");
  const [moreBtnText, setMoreBtnText] = useState<string>("Ещё");
  const [isMoreBtnHovered, setIsMoreBtnHovered] = useState<boolean>(false);

  useEffect(() => {
    if (MENU_SECTIONS.length >= 7) {
      setNavbarDisplayed(MENU_SECTIONS.slice(0, 6));
      setNavbarDropdown(MENU_SECTIONS.slice(6));
    }
    else setNavbarDisplayed(MENU_SECTIONS);
  }, []);

  useEffect(() => {
    const loader = async () => {
      setMenu(await loadJson<Menu>("/data/products.json"));
    };
    loader();
  }, []);

  // Переключатели (скролл-панель) для историй
  const contentRef = useRef<HTMLDivElement>(null);

  // Вычисление позиции для скролл-кнопок
  const checkScrollPosition = () => {
    if (contentRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = contentRef.current;

      setShowLeftBtn(scrollLeft > 2);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  // Обработка скролла для историй влево
  const handleScrollLeft = () => {
    if (contentRef.current) {
      // clientWidth — это ширина видимого "окна" скролла
      // Добавляем + 7, чтобы учесть один gap между элементами при перелистывании
      const scrollStep = contentRef.current.clientWidth + 7;
      contentRef.current.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      console.log(scrollStep);
    }
  };

  // Обработка скролла для историй вправо
  const handleScrollRight = () => {
    if (contentRef.current) {
      const scrollStep = contentRef.current.clientWidth + 7;
      contentRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      console.log(scrollStep + "R");
    }
  };

  console.log(moreBtnId)

  return (
    <>
      {/* Панель с названием и выбранным городом */}
      <nav className="header-panel">
        <div className="left">
          <div className="header-panel-brand-block">
            <img className="header-panel-img" src="/images/dodologo.webp" />
            <div className="header-panel-img-text">
              <div className="title">додо пицца</div>
              <div className="description">1492 пиццерии в 26 странах</div>
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

      {/* Раздел с историями */}
      <section className="story-block">
        {showLeftBtn && <button className="story-block-button prev" onClick={handleScrollLeft}>{"<"}</button>}
        <div className="story-block-content" ref={contentRef} onScroll={checkScrollPosition}>
          <div className="scroll-item"><img src="/images/stories/giveaward-111.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/tom-yam-story.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/dobri-cola.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/giveaward-111.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/tom-yam-story.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/dobri-cola.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/giveaward-111.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/tom-yam-story.webp" /></div>
        </div>
        {showRightBtn && <button className="story-block-button next" onClick={handleScrollRight}>{">"}</button>}
      </section>


      {/* Раздел с навигационной панелью меню */}
      <nav className="menu-navbar">
        <div className="menu-navbar-block">
          <ul className="menu-navbar-block-titles">
            {menu && navbarDisplayed.map((section) => {
              return (
                <li key={section.id}><ScrollLink spy={true} hashSpy={true} smooth={true} offset={-180} duration={0} onSetActive={() => {
                  setMoreBtnId("more");
                  setMoreBtnText("Ещё");
                }} to={section.id}>{section.heading}</ScrollLink></li>
              )
            })}
            {menu && navbarDropdown &&
              <li className="menu-navbar-block-more-button"
                onMouseEnter={() => { setIsMoreBtnHovered(true) }}
                onMouseLeave={() => { setIsMoreBtnHovered(false) }}>

                <ScrollLink spy={true} hashSpy={true} smooth={true} offset={-180} duration={0} to={moreBtnId}>{moreBtnText}</ScrollLink>
                
                <div className={`menu-navbar-block-more ${isMoreBtnHovered ? "visible" : "hidden"}`}><ul>
                  {navbarDropdown.map((section) => {
                    return (
                      <li key={section.id}><ScrollLink spy={true} hashSpy={true} smooth={true} offset={-180} duration={0} onSetActive={() => {
                        setMoreBtnId(section.id);
                        setMoreBtnText(section.heading);
                      }} to={section.id}>{section.heading}</ScrollLink></li>
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
            <span className="popular-products-card-price">245 ₽</span>
          </button>
        </section>
        <div className="menu-container">
          <div>
            {menu && MENU_SECTIONS.map((section) => {
              return (<MenuSection key={section.id} heading={section.heading} type={section.id} menu={menu} />)
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
      </main>

      {/* Сторонние компоненты (ProductPage, Footer) */}
      < Outlet />
    </>
  )
}
