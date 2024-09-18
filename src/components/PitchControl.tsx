import { ReactElement } from "react";
import { Slider } from "./Slider";
import { midiToNote, noteToMidi } from "../util";

import "../scss/pitch-control.css";

interface Props {
  onChange: (values: Array<number>) => void;
  values: Array<number>;
  ineffectivePitches: Array<boolean>;
}

const minValue = 0;
const maxValue = 107;

export const PitchControl = ({ values, onChange, ineffectivePitches }: Props): ReactElement => {
  const handleValueUpdate = (ix: number) => (v: number) => {
    const ret = [...values];
    if (!isNaN(v)) {
      ret[ix] = Math.max(Math.min(v, maxValue), minValue);
    }
    onChange(ret);
  };

  const transposeOctaveUp = () => {
    onChange(values.map(v => Math.min(v + 12, maxValue)));
  }

  const transposeOctaveDown = () => {
    onChange(values.map(v => Math.max(v - 12, minValue)));
  }

  const tryUpdateNote = (ix: number, note: string) => {
    const parsedNote = noteToMidi(note);
    if (parsedNote !== undefined) handleValueUpdate(ix)(parsedNote);
  };

  return (
    <div className="control pitch-control">
      <div className="leftmatter">
        <button onClick={transposeOctaveUp}>+8ve</button>
        <div className="label">Pitch</div>
        <button onClick={transposeOctaveDown}>-8ve</button>
      </div>
      <div className="control-units">
        {values.map((v, ix) => (
          <div className="control-unit" key={ix}>
            <Slider
              key={ix}
              value={v}
              setValue={handleValueUpdate(ix)}
              possibleValues={maxValue + 1}
              pxPerValue={1}
              isIneffective={ineffectivePitches[ix]}
              className="pitch"
            />
            <input
              type="number"
              value={v}
              onChange={(ev) => handleValueUpdate(ix)(Number(ev.target.value))}
            />
            <input
              value={midiToNote(v)}
              onChange={(ev) => tryUpdateNote(ix, ev.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
