import { ReactElement, useEffect, useState } from "react";
import { Slider } from "./Slider";
import { midiToNote, range } from "../util";

import "../scss/pitch-control.css";

interface Props {
  count: number;
}

export const PitchControl = ({ count }: Props): ReactElement => {
  const [values, setValues] = useState<Array<number>>([]);

  useEffect(() => {
    setValues(range(count));
  }, [count]);

  const handleValueUpdate = (ix: number) => (v: number) => {
    setValues((oldValues) => {
      const ret = [...oldValues];
      ret[ix] = v;
      return ret;
    });
  };

  return (
    <div className="control pitch-control">
      {values.map((v, ix) => (
        <div className="control-unit">
          <Slider
            key={ix}
            value={v}
            setValue={handleValueUpdate(ix)}
            possibleValues={128}
            pxPerValue={1}
          />
          <input value={v} />
          <input value={midiToNote(v)} />
        </div>
      ))}
    </div>
  );
};
