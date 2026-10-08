import { useRef, useState } from "react";
import "./Stories.css";


export default function Stories() {

  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

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
    </>
  )
}