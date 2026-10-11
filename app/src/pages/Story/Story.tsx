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

// Bug: sometimes pause does not working and progress bar continue filling
function handleContentBlockClick(event: React.MouseEvent<HTMLDivElement>,
  setActiveImageIndex: React.Dispatch<React.SetStateAction<number>>, storyLength: number): void {
  if (event.target instanceof HTMLElement && event.target.id !== "pause") {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    if (clickX < rect.width / 2) setActiveImageIndex(prev => (prev > 0) ? (prev - 1) : (prev));
    else setActiveImageIndex(prev => (prev < storyLength - 1) ? (prev + 1) : (prev));
  }
}

export default function Story() {

  const navigate = useNavigate();
  const storyID = useParams()["story"];
  const [stories, setStories] = useState<Stories>([]);
  const [story, setStory] = useState<Story>();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const activeStory = useRef<number>(0);

  const [storyProgress, setStoryProgress] = useState<number>(0);
  const paused = useRef<boolean>(false);
  const storyProgressInterval = useRef<number>(0);

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
    setActiveImageIndex(0);
  }, [storyID])

  const storyProgressBarInterval = () => {
    return setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(storyProgressInterval.current);
          if (story && (activeImageIndex < story.content.length - 1)) {
            setActiveImageIndex(prev => prev + 1);
          }
          else if (activeStory.current < stories.length - 1) {
            navigate(`/story/${stories[activeStory.current + 1].id}`);
          }
          else {
            navigate("/");
          }
          return 100;
        }
        return prev + 0.1;
      })
    }, 1)
  }

  useEffect(() => {
    if (storyProgressInterval.current) clearInterval(storyProgressInterval.current);
    storyProgressInterval.current = storyProgressBarInterval();
    setStoryProgress(0);
  }, [story, activeImageIndex])

  const pauseStoryInterval = () => {
    if (!paused.current) {
      clearInterval(storyProgressInterval.current);
      paused.current = true;
    }
    else {
      storyProgressInterval.current = storyProgressBarInterval();
      paused.current = false;
    }
  }

  return (story &&
    <RemoveScroll>
      <div className="story-background" style={{ "--background-img": `url(${story.content[activeImageIndex].imageSource})` } as React.CSSProperties}>
        <div className="story-window">
          <div className="story-panel">
            <button className="scroll-left" onClick={() => navigate(`/story/${stories[activeStory.current > 0 ? activeStory.current - 1 : activeStory.current].id}`)}>{"<"}</button>
            <div className="content-block" onClick={(e) => { handleContentBlockClick(e, setActiveImageIndex, story.content.length) }}>
              <div className="sticks">
                {story.content.map((info, index) => (
                  <div key={index} className="stick">
                    <div className="stick-loading" style={{ width: `${(index === activeImageIndex) ? storyProgress : (activeImageIndex < index) ? 0 : 100}%` }}> </div>
                  </div>
                ))
                }
              </div>
              <button onClick={pauseStoryInterval} id="pause" className="pause">P</button>
              <img src={story.content[activeImageIndex].imageSource} />
              {story.content[activeImageIndex].link &&
                <a className="story-link-block" href={story.content[activeImageIndex].link}>
                </a>
              }
            </div>
            <button className="scroll-right" onClick={() => navigate(`/story/${stories[activeStory.current < stories.length - 1 ? activeStory.current + 1 : activeStory.current].id}`)} >{">"}</button>
            <button className="back" onClick={() => navigate("/")}>X</button>
          </div>
        </div>
      </div>
    </RemoveScroll>
  )
}