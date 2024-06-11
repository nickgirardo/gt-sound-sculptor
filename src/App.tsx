import { useState } from "react";

import { Head } from "./components/Head";
import { Operator } from "./components/Operator";

import "./scss/App.css";

function App() {
  const [count, setCount] = useState<number>(16);

  return (
    <>
      <Head sfxLength={count} setSfxLength={setCount} />
      <div className="main-controls">
        <Operator id="op1" label="op1" count={count} />
        <Operator id="op2" label="op2" count={count} />
        <Operator id="op3" label="op3" count={count} />
        <Operator
          id="op4"
          label="op4"
          count={count}
          ampWarning="Warning: Amplitude values greater than 6 on operator 4 may cause unwanted distortion"
        />
      </div>
    </>
  );
}

export default App;
