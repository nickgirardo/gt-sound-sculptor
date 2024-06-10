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
          <div className="label">OP1</div>
          <div className="controls">
            <AmpControl count={count} />
            <PitchControl count={count} />
          </div>
        </div>
        <div id="op2" className="op">
          <div className="label">OP2</div>
          <div className="controls">
            <AmpControl count={count} />
            <PitchControl count={count} />
          </div>
        </div>
        <div id="op3" className="op">
          <div className="label">OP3</div>
          <div className="controls">
            <AmpControl count={count} />
            <PitchControl count={count} />
          </div>
        </div>
        <div id="op4" className="op">
          <div className="label">OP4</div>
          <div className="controls">
            <AmpControl count={count} />
            <PitchControl count={count} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
