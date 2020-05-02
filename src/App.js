import React from "react";
import "./scss/_modules.scss";

import ChartContainer from "./containers/Chart/ChartContainer";

function App() {
  return (
    <div className='app'>
      <div id='meme-chart'>
        <ChartContainer />
      </div>
    </div>
  );
}

export default App;
