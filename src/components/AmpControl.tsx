import { ReactElement, useEffect, useState } from "react";
import { Slider } from "./Slider";
import { range } from "../util";

import "../scss/amp-control.css";

interface Props {
  count: number;
}

const minValue = 0;
const maxValue = 8;

export const AmpControl = ({ count }: Props): ReactElement => {
  const [values, setValues] = useState<Array<number>>([]);

  useEffect(() => {
    setValues(range(count).map((_v) => 0));
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

  return (
    <div className="control amp-control">
      <div className="label">Amp</div>
      <div className="control-units">
        {values.map((v, ix) => (
          <div className="control-unit">
            <Slider
              key={ix}
              value={v}
              setValue={handleValueUpdate(ix)}
              possibleValues={8}
              pxPerValue={16}
            />
            <input
              value={v}
              onChange={(ev) => handleValueUpdate(ix)(Number(ev.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
