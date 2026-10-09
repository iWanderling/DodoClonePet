import "./Story.css"
import { useNavigate } from "react-router-dom"
import { RemoveScroll } from "react-remove-scroll"

export default function Story() {

  const navigate = useNavigate();


  return (
    <RemoveScroll>
      <div className="story-background">
        <div className="story-panel">
          <button className="scroll-left">{"<"}</button>
          <div className="content-block">
            <div className="sticks">
              <div className="stick"></div>
              <div className="stick"></div>
              <div className="stick"></div>
            </div>
            <button onClick={() => { }} className="pause">P</button>
            <img src="/images/hnjijzxtqnl9kbkmn0fyfggide.webp" />
          </div>
          <button className="scroll-right">{">"}</button>
          <button className="back" onClick={() => navigate("/")}>X</button>
        </div>
      </div>
    </RemoveScroll>
  )
}