import React from "react";
import Header from "./components/Header";
import "./scss/_modules.scss";

function App() {
  return (
    <div className='app'>
      <div id='meme-chart'>
        <Header title={"Meme Charts"} />
      </div>
    </div>
  );
}

export default App;
