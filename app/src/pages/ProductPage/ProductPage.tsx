// Styles
import "./ProductPage.css"

// Modules
import { useNavigate, useParams } from "react-router-dom"
import { RemoveScroll } from "react-remove-scroll"
import { useState, useEffect } from "react";

// Types & Utils
import type { Product, ProductOptions, Toppings, ProductToppings } from "../../types/menu"
import type { InCartProduct } from "../../types/cart"
import loadJson from '../../utils/loadJson'

// Redux Slices & hooks
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addProduct, changeProduct, selectProducts } from "../../features/cartSlice"
import { selectMenu } from "../../features/menuSlice";


// Преобразование описания в строку (если необходимо)
function descriptionConverter(description: string | string[]): string {
  if (Array.isArray(description)) {
    return description.join(", ")
  }
  return description
};

// Найти опцию товара по выбранному размеру/количеству и типу
function optionFinder(product: Product, size: number, kind: string): ProductOptions | undefined {
  return product.options.find(option => (option.size === size && option.kind === kind))
}

// Сделать строку с заглавной буквы
function toCapitalize(string: string) {
  if (!string) return "";
  return string[0].toUpperCase() + string.slice(1);
}

export default function ProductPage({ setActiveProductID, activeProductID = null }: { setActiveProductID: React.Dispatch<React.SetStateAction<string | null>>, activeProductID: string | null }) {

  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectProducts);
  const menu = useAppSelector(selectMenu);

  // Для навигации и ID товара
  const navigate = useNavigate();
  const productID = (activeProductID ? cart.find(product => product.cart_id === activeProductID)?.product_id : useParams()["product"]);

  // Хранение списка опций товара и доступных топпингов для него
  const [product, setProduct] = useState<Product>();
  const [currentOption, setCurrentOption] = useState<ProductOptions>();
  const [productToppings, setProductToppings] = useState<Toppings>();
  const [allToppings, setAllToppings] = useState<Toppings>();
  const [selectedToppings, setSelectedToppings] = useState<ProductToppings["id"][]>([]);
  const [translator, setTranslator] = useState<any>();

  // Состояния типа товара и его размера/количества
  const [allKinds, setAllKinds] = useState<string[]>();
  const [disabledKinds, setDisabledKinds] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<number[]>();

  const [kind, setKind] = useState<string>();
  const [size, setSize] = useState<number>();

  const [removedOptions, setRemovedOptions] = useState<string[]>([]);
  const [nutritionOpened, setNutritionOpened] = useState<boolean>(false);

  const [disabledWindow, setDisabledWindow] = useState<boolean>(false);

  // Загрузка данных о товаре и топпингах (добавить)
  useEffect(() => {
    const loader = async () => {
      const toppings = await loadJson<Toppings>("/data/toppings.json");
      const translator = await loadJson<any>("/data/translator.json");

      setProduct(menu.find(p => p.id === productID));
      setAllToppings(toppings);
      setTranslator(translator);
    };
    loader();
  }, []);

  // Загрузка всех опций выбора размера и типа товара, 
  // его начинок, установка варианта по умолчанию
  useEffect(() => {
    if (product) {
      let sizes: Set<number> = new Set(product.options.map(option => option.size));
      let sortedSizes: number[] = [...sizes].sort((a, b) => a - b);
      setAllSizes(sortedSizes);

      let kinds: Set<string> = new Set(product.options.map(option => option.kind));
      let sortedKinds: string[] = [...kinds].sort();
      setAllKinds(sortedKinds);

      if (!activeProductID) {
        setSize(product.defaultSize);
        setKind(product.defaultKind);
      }

      if (size && kind) setCurrentOption(optionFinder(product, size, kind));
      if (allToppings && currentOption && currentOption.availableToppings) {
        let toppings: ProductToppings[] = [];

        for (let topping_id of currentOption.availableToppings) {
          let topping = allToppings.find((t) => t.id === topping_id);
          if (topping) toppings.push(topping);
        }
        setProductToppings(toppings);
      }
    }
  }, [product, allToppings]);

  // Изменение размера и типа товара
  useEffect(() => {
    if (currentOption) {
      setKind(currentOption.kind);
      setSize(currentOption.size);
    }
    if (allToppings && currentOption && currentOption.availableToppings) {
      let toppings: ProductToppings[] = [];

      for (let topping_id of currentOption.availableToppings) {
        let topping = allToppings.find((t) => t.id === topping_id);
        if (topping) toppings.push(topping);
      }
      setProductToppings(toppings);
    }
    else setProductToppings([]);
  }, [currentOption]);

  // Установка новой выбранной опции
  useEffect(() => {
    if (product && size && kind) {
      let notAvailableKinds: string[] = [];
      let foundOption = optionFinder(product, size, kind);
      if (foundOption) setCurrentOption(foundOption);

      if (allKinds) {
        for (let k of allKinds) {
          let randomOption = optionFinder(product, size, k);
          if (!randomOption) notAvailableKinds.push(k);
          else if (!foundOption) setCurrentOption(randomOption);
        }
      }

      setDisabledKinds(notAvailableKinds);
    }
  }, [size, kind]);

  function getTotalPrice(): number {
    if (currentOption) {
      if (!currentOption.toppingSize) return currentOption.price;
      else if (productToppings) {
        return currentOption.price + productToppings.reduce
          ((sum, topping) => sum + (
            (
              currentOption.toppingSize &&
              currentOption.availableToppings?.includes(topping.id) &&
              selectedToppings.includes(topping.id)
            ) ? topping.prices[currentOption.toppingSize] : 0), 0)
      }
    }
    return 0;
  }

  useEffect(() => {
    if (activeProductID) {
      const cartProduct = cart.find(product => product.cart_id === activeProductID);
      if (cartProduct) {
        const _product = (menu.find(p => p.id === productID));
        if (_product) {
          setCurrentOption(optionFinder(_product, cartProduct.size, cartProduct.kind));
        }
        setKind(cartProduct.kind);
        setSize(cartProduct.size);
        if (cartProduct.selectedToppings) setSelectedToppings(cartProduct.selectedToppings);
        if (cartProduct.removedOptions) setRemovedOptions(cartProduct.removedOptions);
      }
    }
  }, [activeProductID])

  function toCart() {
    if (productID && product && kind && size && currentOption) {
      const productToCart: InCartProduct = {
        cart_id: crypto.randomUUID(),
        product_id: productID,
        amount: 1,
        title: product.title,
        imageSource: currentOption?.imageSource,
        kind,
        size,
        price: getTotalPrice(),
        selectedToppings: selectedToppings,
        removedOptions
      }

      if (!activeProductID) {
        dispatch(addProduct(productToCart));
        navigate("/");
      }
      else {
        productToCart.cart_id = activeProductID;
        dispatch(changeProduct(productToCart));
        setDisabledWindow(true);
        setActiveProductID(null);
      }
    }
  }

  // HTML
  return (product && currentOption && !disabledWindow &&
    <RemoveScroll>
      <div className="modal-product-page">
        <div className="modal-card">
          <img className={`modal-card-product-img ${currentOption.imageScale ? "scale-" + currentOption.imageScale.toString() : ""}`} src={currentOption.imageSource} alt={product.title} />
          <div className="modal-card-product-panel">
            <div className="modal-card-product-content">
              <h2>{product.title}
                <button style={{ "width": "inherit", "height": "inherit" }} className="nutrition-facts-button" onClick={() => setNutritionOpened(prev => !prev)}>O</button></h2>
              {nutritionOpened ? <div className="nutrition-facts-block">
                Пищевая ценность на 100 г <br />
                {currentOption.nutritionFacts &&
                  Object.entries(currentOption.nutritionFacts).map((key, index) => (
                    <span key={index}>{toCapitalize(translator[key[0]])}: {key[1]} {key[0] === "calories" ? translator["ccal"] : translator["g"]} <br /></span>))
                }
              </div> : ""}
              <div className="modal-card-product-panel-type">
                {currentOption.size} {translator[product.measurement_unit]}
                {currentOption.kind != "single" ? ", " + translator[currentOption.kind] + (currentOption.extraDescriptionInfo ? " " + translator[currentOption.extraDescriptionInfo] : "") : ""}
                {currentOption.nutritionFacts?.weight ? ", " + currentOption.nutritionFacts.weight + " " + translator["g"] : ""}
              </div>
              <div className="modal-card-product-panel-description">
                {product.isOptionalDescription && Array.isArray(product.description) &&
                  product.description.map((i) => (
                    (product.removableOptionalDescription && product.removableOptionalDescription.find(r => r === i) ?
                      <a key={i} className={(removedOptions.includes(i) ? "removed" : "not-removed")}>{i} <button
                        onClick={() => setRemovedOptions((prev) => prev.includes(i) ? prev.filter(ri => ri !== i) : [...prev, i])}
                        style={{ "width": "inherit", "height": "inherit" }}>
                        o</button>, </a> : `${i}, `)))
                }
                {!Array.isArray(product.description) && toCapitalize(descriptionConverter(product.description))}
              </div>
              {size && allSizes &&
                <div className="button-option-panel">
                  {allSizes.map((s) => (
                    <button className={(s === size && allSizes.length > 1) ? "active" : ""}
                      key={s} onClick={() => setSize(s)} >{s} {translator[product.measurement_unit]}</button>
                  ))}
                </div>
              }
              {kind && allKinds && allKinds[0] != "single" &&
                <div className="button-option-panel">
                  {allKinds.map((k) => (
                    <button className={(disabledKinds.find(dk => k === dk)) ? "disabled" : (k === kind && allKinds.length > 1) ? "active" : ""}
                      key={k} onClick={(disabledKinds.find(dk => k === dk)) ? () => { } : () => setKind(k)}>
                      {toCapitalize(translator[k])}
                    </button>
                  ))}
                </div>
              }
              {productToppings && productToppings.length > 0 &&
                <div className="add-ingredients-panel">
                  <h3>Добавить по вкусу</h3>
                  <div className="add-ingredients-grid">
                    { // нужно ингредиенты починить
                      productToppings.map((topping, index) => (
                        <button key={index}
                          className={`add-ingredients-card ${selectedToppings && selectedToppings.find((t) => t === topping.id) ? "active" : ""}`}
                          onClick={() => {
                            setSelectedToppings((prev) => prev.includes(topping.id) ?
                              prev.filter((t) => t !== topping.id) :
                              [...prev, topping.id])
                          }}>
                          <img src={topping.imageSource} />
                          <span className="add-ingredients-card-title">{topping.title}</span>
                          <span className="add-ingredients-card-price">
                            {(currentOption.toppingSize) ? topping.prices[currentOption.toppingSize] : topping.prices["tiny"]} ₽</span>
                        </button>)
                      )
                    }
                  </div>
                </div>
              }
            </div>
            <button className="button-cart" onClick={() => { toCart() }}>{(!activeProductID) ? ("В корзину за " + getTotalPrice() + "₽") : "Сохранить"}</button>
          </div>
        </div>

        <button className="close-modal" onClick={() => { (!activeProductID ? navigate("/") : setDisabledWindow(true)) }}>✖</button>
      </div>
    </RemoveScroll >
  )
}