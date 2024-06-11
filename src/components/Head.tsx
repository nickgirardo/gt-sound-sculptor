import React, { ReactElement } from "react";

import "../scss/head.css";

interface Props {
  sfxLength: number;
  setSfxLength: React.Dispatch<React.SetStateAction<number>>;
}

const minSfxLength = 1;
const maxSfxLength = 255;

export const Head = ({ sfxLength, setSfxLength }: Props): ReactElement => {
  const clamp = (n: number, min: number, max: number): number =>
    Math.max(Math.min(n, max), min);

  return (
    <div className="head">
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
    </div>
  );
};
