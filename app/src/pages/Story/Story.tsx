import "./Story.css"
import { useNavigate, useParams } from "react-router-dom"
import { RemoveScroll } from "react-remove-scroll"
import { useEffect, useState } from "react";

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

export default function Story() {

  const navigate = useNavigate();
  const storyID = useParams()["story"];
  const [stories, setStories] = useState<Stories>();
  const [story, setStory] = useState<Story>();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    const loader = async () => {
      const stories = await loadJson<Stories>("/data/stories.json");
      setStories(stories);
      setStory(stories.find(s => s.id === storyID));
    };
    loader();
  }, [])

  return (story &&
    <RemoveScroll>
      {/* style={{ backgroundImage: `url(${story.content[activeImageIndex].imageSource})`}} */}
      <div className="story-background">
        <div className="story-panel">
          <button className="scroll-left" onClick={() => setActiveImageIndex(prev => (prev > 0) ? (prev - 1) : (prev))}>{"<"}</button>
          <div className="content-block">
            <div className="sticks">
              {story.content.map((info, index) => (
                <div key={index} className="stick"></div>
              ))
              }
            </div>
            <button onClick={() => { }} className="pause">P</button>
            <img src={story.content[activeImageIndex].imageSource} />
          </div>
          <button className="scroll-right" onClick={() => setActiveImageIndex(prev => (prev < story.content.length - 1) ? (prev + 1) : (prev))} >{">"}</button>
          <button className="back" onClick={() => navigate("/")}>X</button>
        </div>
      </div>
    </RemoveScroll>
  )
}