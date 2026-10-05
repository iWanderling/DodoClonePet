import "./Main.css"
import { Outlet, useNavigate } from "react-router-dom"
import Card from "../../components/Card/Card"
import { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { useInView } from "react-intersection-observer"

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
function MenuSection({ heading, type, menu, setActiveSection }: { heading: string, type: string, menu: Menu, setActiveSection: (id: string) => void }) {

  const { ref, inView } = useInView({
    root: document.querySelector("menu"),
    threshold: 0.8,
    rootMargin: "-100px 0px",
  })

  useEffect(() => {
    if (inView) setActiveSection(type);
  }, [inView, type, setActiveSection])

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
    <section ref={ref} className="menu-content-section" id={type}>
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

  // Состояния отображения выпадающей навпанели
  const [navbarDisplayed, setNavbarDisplayed] = useState<{ id: string, heading: string }[]>([]);
  const [navbarDropdown, setNavbarDropdown] = useState<{ id: string, heading: string }[]>([]);

  // Состояния выпадающей навпанели
  const [activeSection, setActiveSection] = useState<string>("more");
  const [dropdownTitle, setDropdownTitle] = useState<string>("Ещё");
  const [isDropdownHovered, setIsDropdownHovered] = useState<boolean>(false);

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

  // Обработка скролл-панели для историй
  const storiesContentRef = useRef<HTMLDivElement>(null);
  const storiesFunctions = {
    // Вычисление позиции для скролл-кнопок
    checkScrollPosition: () => {
      if (storiesContentRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = storiesContentRef.current;

        setShowLeftBtn(scrollLeft > 2);
        setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 2);
      }
    },
    // Обработка скролла для историй влево
    handleScrollLeft: () => {
      if (storiesContentRef.current) {
        // clientWidth — это ширина видимого "окна" скролла
        // Добавляем + 7, чтобы учесть один gap между элементами при перелистывании
        const scrollStep = storiesContentRef.current.clientWidth + 7;
        storiesContentRef.current.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      }
    },
    // Обработка скролла для историй вправо
    handleScrollRight: () => {
      if (storiesContentRef.current) {
        const scrollStep = storiesContentRef.current.clientWidth + 7;
        storiesContentRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }
  }

  return (
    <>
      {/* Панель с названием и выбранным городом */}
      <nav className="header-panel">
        <div className="left">
          <div className="header-panel-brand-block">
            <img className="header-panel-img" src="/images/dodologo.webp" />
            <div className="header-panel-img-text">
              <div className="title">додо пицца</div>
              <div className="description">1492 пиццерии в 26 странах {activeSection}</div>
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
        {showLeftBtn && <button className="story-block-button prev" onClick={storiesFunctions.handleScrollLeft}>{"<"}</button>}
        <div className="story-block-content" ref={storiesContentRef} onScroll={storiesFunctions.checkScrollPosition}>
          <div className="scroll-item"><img src="/images/stories/giveaward-111.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/tom-yam-story.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/dobri-cola.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/giveaward-111.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/tom-yam-story.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/dobri-cola.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/giveaward-111.webp" /></div>
          <div className="scroll-item"><img src="/images/stories/tom-yam-story.webp" /></div>
        </div>
        {showRightBtn && <button className="story-block-button next" onClick={storiesFunctions.handleScrollRight}>{">"}</button>}
      </section>


      {/* Раздел с навигационной панелью меню */}
      <nav className="menu-navbar">
        <div className="menu-navbar-block">
          <ul className="menu-navbar-block-titles">
            {menu && navbarDisplayed.map((section) => {
              return (
                <li key={section.id}>
                  <Link offset={-180} to={section.id} className={activeSection === section.id ? "active" : ""}>
                    {section.heading}
                  </Link>
                </li>
              )
            })}
            {menu && navbarDropdown &&
              <li className="menu-navbar-block-more-button" key={activeSection}
                onMouseEnter={() => { setIsDropdownHovered(true) }}
                onMouseLeave={() => { setIsDropdownHovered(false) }}>

                <a className={navbarDropdown.find(section => section.id === activeSection) ? "active" : ""}>{navbarDropdown.find(section => section.id === activeSection) ? navbarDropdown.find(section => section.id === activeSection)?.heading : dropdownTitle}</a>

                <div className={`menu-navbar-block-more ${isDropdownHovered ? "visible" : "hidden"}`}><ul>
                  {navbarDropdown.map((section) => {
                    return (
                      <li key={section.id}><Link offset={-180} to={section.id}>{section.heading}</Link></li>
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
      </main>

      {/* Сторонние компоненты (ProductPage, Footer) */}
      < Outlet />
    </>
  )
}