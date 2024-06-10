import { useState } from "react";

import { AmpControl } from "./components/AmpControl";
import { PitchControl } from "./components/PitchControl";

import "./scss/App.css";

function App() {
  const [count, setCount] = useState<number>(16);

  return (
    <>
      <div>
        <label htmlFor="frame-count">Length in frames</label>
        <input
          id="frame-count"
          type="number"
          value={count}
          onChange={(ev) => setCount(Number(ev.target.value))}
        />
      </div>
      <div className="main-controls">
        <div id="op1" className="op">
          <AmpControl count={count} />
          <PitchControl count={count} />
        </div>
        <div id="op2" className="op">
          <AmpControl count={count} />
          <PitchControl count={count} />
        </div>
        <div id="op3" className="op">
          <AmpControl count={count} />
          <PitchControl count={count} />
        </div>
        <div id="op4" className="op">
          <AmpControl count={count} />
          <PitchControl count={count} />
        </div>
      </div>
    </>
  );
}

export default App;
