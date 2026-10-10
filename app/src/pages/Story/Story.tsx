import "./Story.css"
import { useNavigate, useParams } from "react-router-dom"
import { RemoveScroll } from "react-remove-scroll"
import { useEffect, useState, useRef } from "react";



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
  const [stories, setStories] = useState<Stories>([]);
  const [story, setStory] = useState<Story>();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const activeStory = useRef<number>(0);

  useEffect(() => {
    const loader = async () => {
      const stories = await loadJson<Stories>("/data/stories.json");
      const story = stories.find(s => s.id === storyID);

      for (let i = 0; i < stories.length; i++) {
        if (stories[i] === story) {
          activeStory.current = i;
          break;
        }
      }
      setStories(stories);
      setStory(story);
    };
    loader();
  }, [storyID])

  // onClick={() => setActiveImageIndex(prev => (prev > 0) ? (prev - 1) : (prev))}
  return (story &&
    <RemoveScroll>
      <div className="story-background" style={{ "--background-img": `url(${story.content[activeImageIndex].imageSource})` } as React.CSSProperties}>
        <div className="story-window">
          <div className="story-panel">
            <button className="scroll-left" onClick={() => navigate(`/story/${stories[activeStory.current > 0 ? activeStory.current - 1 : activeStory.current].id}`)}>{"<"}</button>
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
            <button className="scroll-right" onClick={() => navigate(`/story/${stories[activeStory.current < stories.length - 1 ? activeStory.current + 1 : activeStory.current].id}`)} >{">"}</button>
            <button className="back" onClick={() => navigate("/")}>X</button>
          </div>
        </div>
      </div>
    </RemoveScroll>
  )
}