import { ReactElement, useEffect, useState } from "react";
import { Slider } from "./Slider";
import { midiToNote, noteToMidi, range } from "../util";

import "../scss/pitch-control.css";

interface Props {
  count: number;
}

const minValue = 0;
const maxValue = 127;

export const PitchControl = ({ count }: Props): ReactElement => {
  const [values, setValues] = useState<Array<number>>([]);

  useEffect(() => {
    setValues(range(count));
  }, [count]);

  const handleValueUpdate = (ix: number) => (v: number) => {
    setValues((oldValues) => {
      const ret = [...oldValues];
      if (!isNaN(v)) {
        ret[ix] = Math.max(Math.min(v, maxValue), minValue);
      }

      return ret;
    });
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
          <div className="control-unit">
            <Slider
              key={ix}
              value={v}
              setValue={handleValueUpdate(ix)}
              possibleValues={128}
              pxPerValue={1}
            />
            <input
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
