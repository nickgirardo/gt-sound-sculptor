import React, { ReactElement } from "react";

import "../scss/head.css";

interface Props {
  sfxLength: number;
  setSfxLength: React.Dispatch<React.SetStateAction<number>>;
}

export const Head = ({ sfxLength, setSfxLength }: Props): ReactElement => (
  <div className="head">
    <label htmlFor="frame-count">Length in frames</label>
    <input
      id="frame-count"
      type="number"
      value={sfxLength}
      onChange={(ev) => setSfxLength(Number(ev.target.value))}
    />
  </div>
);
