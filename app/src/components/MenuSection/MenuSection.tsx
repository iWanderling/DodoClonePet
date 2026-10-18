import Card from "../../components/Card/Card"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import "./MenuSection.css"
import type { Product, Menu } from "../../types/menu"

// Тип данных для вывода товаров из определённого раздела меню
interface MenuSectionOutputData {
  id: string,
  title: string,
  imageSource: string,
  price: number,
  hasOptions: boolean,
  flag: string | null
}

// Создание разделов для меню
export default function MenuSection({ heading, type, menu, setActiveSection }: { heading: string, type: string, menu: Menu, setActiveSection: (id: string) => void }) {

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