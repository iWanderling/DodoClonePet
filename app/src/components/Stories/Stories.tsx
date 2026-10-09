import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Stories.css";

type Stories = Story[];

interface Story {
  id: string,
  previewImageSource: string,
  content: {
    imageSource: string,
    link?: string
  }[]
}

// Загрузка JSON-данных
async function loadJson<T>(source: string): Promise<T> {
  const response = await fetch(source);
  if (!response.ok) throw Error("Ошибка загрузки данных :(");
  return await response.json();
};

export default function Stories() {

  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [stories, setStories] = useState<Stories>();

  useEffect(() => {
    const loader = async () => {
      const stories = await loadJson<Stories>("/data/stories.json");
      setStories(stories);
    };
    loader();
  }, [])

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

  return (stories &&
    <>
      <section className="story-block">
        {showLeftBtn && <button className="story-block-button prev" onClick={storiesFunctions.handleScrollLeft}>{"<"}</button>}
        {stories.map((story, index) => (
          <div key={index} className="story-block-content" ref={storiesContentRef} onScroll={storiesFunctions.checkScrollPosition}>
            <Link to={`/story/${story.id}`} className="scroll-item"><img src={story.previewImageSource} /></Link>
          </div>
        ))}
        {showRightBtn && <button className="story-block-button next" onClick={storiesFunctions.handleScrollRight}>{">"}</button>}
      </section>
    </>
  )
}