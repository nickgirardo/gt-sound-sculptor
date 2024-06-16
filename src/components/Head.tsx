import React, { ForwardedRef, ReactElement, forwardRef } from "react";
import { GTEmulator } from "./GTEmulator";

import "../scss/head.css";

interface Props {
  sfxLength: number;
  setSfxLength: React.Dispatch<React.SetStateAction<number>>;
  feedback: number;
  setFeedback: React.Dispatch<React.SetStateAction<number>>;
  handleExport: () => void;
  handlePreview: () => void;
}

const minSfxLength = 1;
const maxSfxLength = 255;

const minFeedback = 0;
const maxFeedback = 8;

export const Head = forwardRef(
  (
    {
      sfxLength,
      setSfxLength,
      feedback,
      setFeedback,
      handleExport,
      handlePreview,
    }: Props,
    emuRef: ForwardedRef<HTMLIFrameElement>,
  ): ReactElement => {
    const clamp = (n: number, min: number, max: number): number =>
      Math.max(Math.min(n, max), min);

    return (
      <div className="head">
        <div>
          <label htmlFor="frame-count">Length in frames</label>
          <input
            id="frame-count"
            type="number"
            max={maxSfxLength}
            min={minSfxLength}
            value={sfxLength}
            onChange={(ev) =>
              setSfxLength(
                clamp(Number(ev.target.value), minSfxLength, maxSfxLength),
              )
            }
          />
          <label htmlFor="feedback-amount">Feedback Amount</label>
          <input
            id="feedback-amount"
            type="number"
            max={maxFeedback}
            min={minFeedback}
            value={feedback}
            onChange={(ev) =>
              setFeedback(
                clamp(Number(ev.target.value), minFeedback, maxFeedback),
              )
            }
          />
        </div>
        <GTEmulator ref={emuRef} />
        <div>
          <button onClick={handlePreview}>Preview</button>
          <button onClick={handleExport}>Export</button>
        </div>
      </div>
    );
  },
);
