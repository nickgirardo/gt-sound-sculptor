import { useState } from "react";

import { Operator } from "./components/Operator";

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
        <Operator id="op1" label="op1" count={count} />
        <Operator id="op2" label="op2" count={count} />
        <Operator id="op3" label="op3" count={count} />
        <Operator id="op4" label="op4" count={count} />
      </div>
    </>
  );
}

export default App;
