import { ReactElement, useEffect, useState } from "react";
import { Slider } from "./Slider";
import { range } from "../util";

import "../scss/amp-control.css";

interface Props {
  count: number;
}

export const AmpControl = ({ count }: Props): ReactElement => {
  const [values, setValues] = useState<Array<number>>([]);

  useEffect(() => {
    setValues(range(count).map((v) => v % 8));
  }, [count]);

  const handleValueUpdate = (ix: number) => (v: number) => {
    setValues((oldValues) => {
      const ret = [...oldValues];
      ret[ix] = v;
      return ret;
    });
  };

  return (
    <div className="control amp-control">
      {values.map((v, ix) => (
        <div className="control-unit">
          <Slider
            key={ix}
            value={v}
            setValue={handleValueUpdate(ix)}
            possibleValues={8}
            pxPerValue={16}
          />
          <input value={v} />
        </div>
      ))}
    </div>
  );
};
