import { useEffect, useState } from "react";

import { saveFile, zeroArray } from "./util";

import { Head } from "./components/Head";
import { Operator } from "./components/Operator";

import "./scss/App.css";

function App() {
  const [sfxLength, setSfxLength] = useState<number>(16);
  const [feedback, setFeedback] = useState<number>(0);

  // A bit lazy here but I don't care lol
  const [op1Amps, setOp1Amps] = useState<Array<number>>(zeroArray(sfxLength));
  const [op1Pitches, setOp1Pitches] = useState<Array<number>>(
    zeroArray(sfxLength),
  );
  const [op2Amps, setOp2Amps] = useState<Array<number>>(zeroArray(sfxLength));
  const [op2Pitches, setOp2Pitches] = useState<Array<number>>(
    zeroArray(sfxLength),
  );
  const [op3Amps, setOp3Amps] = useState<Array<number>>(zeroArray(sfxLength));
  const [op3Pitches, setOp3Pitches] = useState<Array<number>>(
    zeroArray(sfxLength),
  );
  const [op4Amps, setOp4Amps] = useState<Array<number>>(zeroArray(sfxLength));
  const [op4Pitches, setOp4Pitches] = useState<Array<number>>(
    zeroArray(sfxLength),
  );

  useEffect(() => {
    const handlers = [
      setOp1Amps,
      setOp1Pitches,
      setOp2Amps,
      setOp2Pitches,
      setOp3Amps,
      setOp3Pitches,
      setOp4Amps,
      setOp4Pitches,
    ];

    for (const handler of handlers) {
      handler((oldValues) => {
        if (oldValues.length < sfxLength) {
          return [
            ...oldValues,
            ...new Array(sfxLength - oldValues.length).fill(oldValues.at(-1)),
          ];
        } else {
          return [...oldValues.slice(0, sfxLength)];
        }
      });
    }
  }, [sfxLength]);

  const prepBinary = (sfxbin:ArrayBuffer) => {
    const view = new Uint8Array(sfxbin);

    view[0] = sfxLength;
    view[1] = feedback;

    for (var i = 0; i < sfxLength; i++) {
      // NOTE the offsets here start at +2 because the first two elements are length and feedback
      view[i * 8 + 2] = op1Amps[i];
      view[i * 8 + 3] = op2Amps[i];
      view[i * 8 + 4] = op3Amps[i];
      view[i * 8 + 5] = op4Amps[i];
      view[i * 8 + 6] = op1Pitches[i];
      view[i * 8 + 7] = op2Pitches[i];
      view[i * 8 + 8] = op3Pitches[i];
      view[i * 8 + 9] = op4Pitches[i];
    }
    return view;
  };

  const exportFile = () => {
    const sfxbin = new ArrayBuffer(sfxLength * 8 + 2);
    prepBinary(sfxbin);
    saveFile(sfxbin, "sfx.bin");
  };

  const previewSound = () => {
    const sfxbin = new ArrayBuffer(sfxLength * 8 + 2);
    const arr = prepBinary(sfxbin);
    const buf = Module._malloc(sfxbin.byteLength);
    Module.HEAP8.set(arr, buf);
    Module.EMApplyPatch(buf, sfxbin.byteLength, 32768);
    Module.ccall('SetButtons', null, ["int"], [0b0000000000010000]);
    setTimeout(()=>{Module.ccall('SetButtons', null, ["int"], [0]);}, 100);
  };

  return (
    <>
      <Head
        sfxLength={sfxLength}
        setSfxLength={setSfxLength}
        feedback={feedback}
        setFeedback={setFeedback}
        handleExport={exportFile}
        handlePreview={previewSound}
      />
      <div className="main-controls">
        <Operator
          id="op1"
          label="op1"
          ampValues={op1Amps}
          setAmpValues={setOp1Amps}
          pitchValues={op1Pitches}
          setPitchValues={setOp1Pitches}
        />
        <Operator
          id="op2"
          label="op2"
          ampValues={op2Amps}
          setAmpValues={setOp2Amps}
          pitchValues={op2Pitches}
          setPitchValues={setOp2Pitches}
        />
        <Operator
          id="op3"
          label="op3"
          ampValues={op3Amps}
          setAmpValues={setOp3Amps}
          pitchValues={op3Pitches}
          setPitchValues={setOp3Pitches}
        />
        <Operator
          id="op4"
          label="op4"
          ampValues={op4Amps}
          setAmpValues={setOp4Amps}
          pitchValues={op4Pitches}
          setPitchValues={setOp4Pitches}
          ampWarning="Warning: Amplitude values greater than 6 on operator 4 may cause unwanted distortion"
        />
      </div>
    </>
  );
}

export default App;
