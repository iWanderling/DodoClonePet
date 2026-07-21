import "./Main.css"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import Card from "../../components/Card/Card"
import { useState, useEffect, useRef } from "react";
import { Link as ScrollLink } from "react-scroll"


interface BaseProduct {
  id: string,
  title: string,
  description: string | string[],
  price?: number
}

// Record <string, number> => [20, 25, 30, 35]:number(optional)
interface PizzaCard extends BaseProduct {
  removableIngredients?: string[],
  grams: {
    traditional: Record<string, number>,
    thin: Record<string, number>,
  },
  variations: Record<string, number>,
  extraIngredients?: string[],
  excludedForThinDough?: string[]
}

interface RomeCard extends BaseProduct {
  grams: number,
  removableIngredients?: string[],
  extraIngredients?: string[]
}

interface ProductCard extends BaseProduct {
  grams: number | Record<string, number>,
  variations?: Record<string, number>
}

interface ComboCard { }

function getProductInfo(menu: Menu, ID: string): any {
  for (const [key, products] of Object.entries(menu))
    for (const product of products) {
      if (product.id === ID) return [key, product]
    }
  return null;
}

interface Menu {
  ingredients: any,
  pizzas: PizzaCard,
  combos: any,
  romes: RomeCard,
  appetizers: ProductCard,
  "coffee-and-tea": ProductCard,
  drinks: ProductCard,
  desserts: ProductCard,
  breakfasts: ProductCard,
  sauces: BaseProduct,
  others: BaseProduct
}

interface Product {
  title: string,
  source: string,
  price: number
}

const MENU_SECTIONS: { id: keyof Menu, heading: string }[] = [
  { id: "pizzas", heading: "Пиццы" },
  { id: "combos", heading: "Комбо" },
  { id: "romes", heading: "Римские пиццы" },
  { id: "appetizers", heading: "Закуски" },
  { id: "coffee-and-tea", heading: "Кофе и чай" },
  { id: "drinks", heading: "Напитки" },
  { id: "breakfasts", heading: "Завтраки" },
  { id: "desserts", heading: "Десерты" },
  { id: "sauces", heading: "Соусы" },
  { id: "others", heading: "Другие товары" }
]

const IMG_PATHS = {
  "pizzas": "/images/pizzas/",
  "combos": "/images"
}

async function loadJson<T>(source: string): Promise<T> {
  const response = await (fetch(source));
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
}


function MenuSection({ id, heading, data }: { id: string, heading: string, data: any[] }) {

  return (
    <section className="menu-content-section">
      <h1 className="menu-content-heading" id={id}>{heading}</h1>
      <div className="menu-content">
        {data.map((product, index) => (
          <Card
            key={index}
            source={`/images/${(id === "coffee-and-tea" ? "drinks" : id)}/${product.id}.webp`}
            title={product.title}
            price={!product.price ? product.variations[Object.keys(product.variations)[0]] : product.price}
            hasVariations={product.variations && Object.keys(product.variations).length > 1 ? true : false} />
        ))}
      </div>
    </section>
  )
}

export default function Main() {

  const navigate = useNavigate();
  const [menu, setMenu] = useState<Menu>();
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setMenu(await loadJson<Menu>("/products.json"));
    };
    fetchMenu();
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (contentRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = contentRef.current;

      setShowLeftBtn(scrollLeft > 2);
      console.log(scrollLeft, scrollWidth, clientWidth);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }

  const handleScrollLeft = () => {
    if (contentRef.current) {
      // clientWidth — это ширина видимого "окна" скролла
      // Добавляем + 7, чтобы учесть один gap между элементами при перелистывании
      const scrollStep = contentRef.current.clientWidth + 7;
      contentRef.current.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      console.log(scrollStep);
    }

  };

  const handleScrollRight = () => {
    if (contentRef.current) {
      const scrollStep = contentRef.current.clientWidth + 7;
      contentRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      console.log(scrollStep + "R");
    }
  };


  return (
    <>
      <nav className="header-panel">
        <div className="left">
          <div className="header-panel-brand-block">
            <img className="header-panel-img" src="/images/brand/dodologos.webp" />
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
          <button className="header-panel-btn">Войти</button>
        </div>
      </nav>

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

      <nav className="menu-navbar">
        <div className="menu-navbar-block">
          <ul className="menu-navbar-block-titles">
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} activeClass="active" to="pizzas">Пиццы</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="combos">Комбо</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="romes">Римские пиццы</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="appetizers">Закуски</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="coffee-and-tea">Кофе и чай</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="drinks">Напитки</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="breakfasts">Завтраки</ScrollLink></li>
            <li><ScrollLink spy={true} smooth={true} offset={-130} duration={200} to="desserts">Десерты</ScrollLink></li>
            <li><button className="menu-navbar-more-button">Ещё</button></li>
          </ul>
          <button className="menu-navbar-button" onClick={() => navigate("/")}>Корзина</button>
        </div>
      </nav>

      <main className="menu">

        <div className="menu-container">

          <div>
            {menu && MENU_SECTIONS.map((section) => {
              const products = menu[section.id];
              return (
                <MenuSection key={section.id} heading={section.heading} id={section.id} data={products} />
              )
            })}
          </div>

          <aside className="sidebar">
            <div className="aside-img-container">
              <img src="/images/brand/aside1.webp" />
              <div className="aside-img-text-block">
                <div className="title">В приложении выгоднее</div>
                <div className="description">Скачайте и получайте бонусы</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Outlet />
    </>
  )
}
