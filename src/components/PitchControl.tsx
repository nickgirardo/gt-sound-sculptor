import { ReactElement } from "react";
import { Slider } from "./Slider";
import { midiToNote, noteToMidi } from "../util";

import "../scss/pitch-control.css";

interface Props {
  onChange: (values: Array<number>) => void;
  values: Array<number>;
}

const minValue = 0;
const maxValue = 107;

export const PitchControl = ({ values, onChange }: Props): ReactElement => {
  const handleValueUpdate = (ix: number) => (v: number) => {
    const ret = [...values];
    if (!isNaN(v)) {
      ret[ix] = Math.max(Math.min(v, maxValue), minValue);
    }
    onChange(ret);
  };

  const tryUpdateNote = (ix: number, note: string) => {
    const parsedNote = noteToMidi(note);
    if (parsedNote !== undefined) handleValueUpdate(ix)(parsedNote);
  };

  return (
    <div className="control pitch-control">
      <div className="label">Pitch</div>
      <div className="control-units">
        {values.map((v, ix) => (
          <div className="control-unit" key={ix}>
            <Slider
              key={ix}
              value={v}
              setValue={handleValueUpdate(ix)}
              possibleValues={maxValue + 1}
              pxPerValue={1}
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
