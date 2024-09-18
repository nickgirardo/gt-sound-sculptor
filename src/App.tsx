import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { debounce } from "ts-debounce";

import { saveFile, zeroArray } from "./util";
import { encodeSFX } from "./encode";
import { decodeSFX } from "./decode";

import { Head } from "./components/Head";
import { Operator } from "./components/Operator";

import "./scss/App.css";

const updateHistory = debounce(
  (url) => history.replaceState(null, "", url),
  100,
);

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
    const params = new URL(window.location.href).searchParams;
    const sfxData = params.get("sfx");

    if (sfxData) {
      const appData = decodeSFX(sfxData);

      if (appData) {
        setFeedback(appData.feedback);
        setSfxLength(appData.sfxLength);
        setOp1Amps(appData.op1Amps);
        setOp1Pitches(appData.op1Pitches);
        setOp2Amps(appData.op2Amps);
        setOp2Pitches(appData.op2Pitches);
        setOp3Amps(appData.op3Amps);
        setOp3Pitches(appData.op3Pitches);
        setOp4Amps(appData.op4Amps);
        setOp4Pitches(appData.op4Pitches);
      }
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    params.set(
      "sfx",
      encodeSFX(
        sfxLength,
        feedback,
        op1Amps,
        op1Pitches,
        op2Amps,
        op2Pitches,
        op3Amps,
        op3Pitches,
        op4Amps,
        op4Pitches,
      ),
    );

    updateHistory(url);
  }, [
    sfxLength,
    feedback,
    op1Amps,
    op1Pitches,
    op2Amps,
    op2Pitches,
    op3Amps,
    op3Pitches,
    op4Amps,
    op4Pitches,
  ]);

  const emuRef = useRef<HTMLIFrameElement>(null);


  const prepBinary = (sfxbin: ArrayBuffer): Uint8Array => {
    const view = new Uint8Array(sfxbin);

    view[0] = sfxLength;
    view[1] = feedback;

    for (let i = 0; i < sfxLength; i++) {
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

  const importFile = (data: ArrayBuffer) => {
    const view = new Uint8Array(data);
    const sfxLength = view[0];
    const feedback = view[1];
    const op1Amps = [];
    const op1Pitches = [];
    const op2Amps = [];
    const op2Pitches = [];
    const op3Amps = [];
    const op3Pitches = [];
    const op4Amps = [];
    const op4Pitches = [];

    for (let i = 0; i < sfxLength; i++) {
      op1Amps.push(view[i * 8 + 2]);
      op2Amps.push(view[i * 8 + 3]);
      op3Amps.push(view[i * 8 + 4]);
      op4Amps.push(view[i * 8 + 5]);
      op1Pitches.push(view[i * 8 + 6]);
      op2Pitches.push(view[i * 8 + 7]);
      op3Pitches.push(view[i * 8 + 8]);
      op4Pitches.push(view[i * 8 + 9]);
    }

    setSfxLength(sfxLength);
    setFeedback(feedback);
    setOp1Amps(op1Amps);
    setOp1Pitches(op1Pitches);
    setOp2Amps(op2Amps);
    setOp2Pitches(op2Pitches);
    setOp3Amps(op3Amps);
    setOp3Pitches(op3Pitches);
    setOp4Amps(op4Amps);
    setOp4Pitches(op4Pitches);
  };

  const previewSound = () => {
    const sfxbin = new ArrayBuffer(sfxLength * 8 + 2);
    const view = prepBinary(sfxbin);

    if (emuRef.current && emuRef.current.contentWindow) {
      // TODO type this properly
      //@ts-ignore
      emuRef.current.contentWindow.playSound(sfxbin, view);
    }
  };

  // A simple wrapper around setSfxLength
  // This handles updating all of the other values (e.g. op1Amps) to have the correct length
  // In general this should be preferred over manually using `setSfxLength` unless updating multiple
  // fields at the same time as the sfxLength (e.g. loading from query param on initial page load)
  const updateSfxLength = (length: number) => {
    setSfxLength(length);

    const updaters: Array<[Array<number>, Dispatch<SetStateAction<Array<number>>>]> = [
      [op1Amps, setOp1Amps],
      [op1Pitches, setOp1Pitches],
      [op2Amps, setOp2Amps],
      [op2Pitches, setOp2Pitches],
      [op3Amps, setOp3Amps],
      [op3Pitches, setOp3Pitches],
      [op4Amps, setOp4Amps],
      [op4Pitches, setOp4Pitches],
    ];

    // No change in sfxLength, no work needs to be done
    if (length === sfxLength)
      return;

    // Extend sfx
    // We take the last set value and use it for all new values
    if (length > sfxLength) {
      for (const [value, updateFn] of updaters) {
        updateFn([
          ...value,
          ...new Array(length - value.length).fill(value.at(-1)),
        ]);
      }
    }

    // Shorten sfx
    // Just truncate the values
    if (length < sfxLength) {
      for (const [value, updateFn] of updaters) {
        updateFn([...value.slice(0, length)]);
      }
    }
  }

  // Which controls don't contribute to the final sound? We'll gray these out
  const ineffectiveOp4Amps = new Array(sfxLength).fill(false);
  const ineffectiveOp4Pitches = op4Amps.map(p => p === 0);
  const ineffectiveOp3Amps = ineffectiveOp4Pitches;
  const ineffectiveOp3Pitches = op3Amps.map((p, ix) => p === 0 || ineffectiveOp4Pitches[ix]);
  const ineffectiveOp2Amps = ineffectiveOp3Pitches;
  const ineffectiveOp2Pitches = op2Amps.map((p, ix) => p === 0 || ineffectiveOp3Pitches[ix]);
  const ineffectiveOp1Amps = ineffectiveOp2Pitches;
  const ineffectiveOp1Pitches = op1Amps.map((p, ix) => p === 0 || ineffectiveOp2Pitches[ix]);

  return (
    <>
      <Head
        sfxLength={sfxLength}
        setSfxLength={updateSfxLength}
        feedback={feedback}
        setFeedback={setFeedback}
        handleExport={exportFile}
        handleImport={importFile}
        handlePreview={previewSound}
        ref={emuRef}
      />
      <div className="main-controls">
        <Operator
          id="op1"
          label="op1"
          ampValues={op1Amps}
          setAmpValues={setOp1Amps}
          pitchValues={op1Pitches}
          ineffectivePitches={ineffectiveOp1Pitches}
          ineffectiveAmps={ineffectiveOp1Amps}
          setPitchValues={setOp1Pitches}
        />
        <Operator
          id="op2"
          label="op2"
          ampValues={op2Amps}
          setAmpValues={setOp2Amps}
          pitchValues={op2Pitches}
          ineffectivePitches={ineffectiveOp2Pitches}
          ineffectiveAmps={ineffectiveOp2Amps}
          setPitchValues={setOp2Pitches}
        />
        <Operator
          id="op3"
          label="op3"
          ampValues={op3Amps}
          setAmpValues={setOp3Amps}
          pitchValues={op3Pitches}
          ineffectivePitches={ineffectiveOp3Pitches}
          ineffectiveAmps={ineffectiveOp3Amps}
          setPitchValues={setOp3Pitches}
        />
        <Operator
          id="op4"
          label="op4"
          ampValues={op4Amps}
          setAmpValues={setOp4Amps}
          pitchValues={op4Pitches}
          ineffectivePitches={ineffectiveOp4Pitches}
          ineffectiveAmps={ineffectiveOp4Amps}
          setPitchValues={setOp4Pitches}
          highAmpWarning={7}
        />
      </div>
    </>
  );
}

export default App;
