import { useState } from "react";

import { Head } from "./components/Head";
import { Operator } from "./components/Operator";

import "./scss/App.css";

function App() {
  const [sfxLength, setSfxLength] = useState<number>(16);
  const [feedback, setFeedback] = useState<number>(0);

  return (
    <>
      <Head
        sfxLength={sfxLength}
        setSfxLength={setSfxLength}
        feedback={feedback}
        setFeedback={setFeedback}
      />
      <div className="main-controls">
        <Operator id="op1" label="op1" count={sfxLength} />
        <Operator id="op2" label="op2" count={sfxLength} />
        <Operator id="op3" label="op3" count={sfxLength} />
        <Operator
          id="op4"
          label="op4"
          count={sfxLength}
          ampWarning="Warning: Amplitude values greater than 6 on operator 4 may cause unwanted distortion"
        />
      </div>
    </>
  );
}

export default App;
