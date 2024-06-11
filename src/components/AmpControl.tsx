import { ReactElement } from "react";
import { Slider } from "./Slider";

import "../scss/amp-control.css";

interface Props {
  onChange: (values: Array<number>) => void;
  values: Array<number>;
}

const minValue = 0;
const maxValue = 8;

export const AmpControl = ({ onChange, values }: Props): ReactElement => {
  const handleValueUpdate = (ix: number) => (v: number) => {
    const ret = [...values];
    if (!isNaN(v)) {
      ret[ix] = Math.max(Math.min(v, maxValue), minValue);
    }
    onChange(ret);
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
