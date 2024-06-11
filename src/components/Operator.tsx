import { ReactElement, useEffect, useState } from "react";

import { range } from "../util";
import { AmpControl } from "./AmpControl";
import { PitchControl } from "./PitchControl";

import "../scss/operator.css";

interface Props {
  id: string;
  label: string;
  count: number;
  ampWarning?: string;
}

export const Operator = ({
  id,
  label,
  count,
  ampWarning,
}: Props): ReactElement => {
  useEffect(() => {
    setAmpValues((oldValues) => {
      if (oldValues.length < count) {
        return [
          ...oldValues,
          ...range(count - oldValues.length).fill(oldValues.at(-1)),
        ];
      } else {
        return [...oldValues.slice(0, count)];
      }
    });
    setPitchValues((oldValues) => {
      if (oldValues.length < count) {
        return [
          ...oldValues,
          ...range(count - oldValues.length).fill(oldValues.at(-1)),
        ];
      } else {
        return [...oldValues.slice(0, count)];
      }
    });
  }, [count]);

  const [ampValues, setAmpValues] = useState<Array<number>>(
    range(count).fill(0),
  );
  const [pitchValues, setPitchValues] = useState<Array<number>>(
    range(count).fill(0),
  );

  return (
    <div id={id} className="op">
      <div className="label">{label}</div>
      <div className="controls">
        <AmpControl
          onChange={setAmpValues}
          values={ampValues}
          ampWarning={ampWarning}
        />
        <PitchControl onChange={setPitchValues} values={pitchValues} />
      </div>
    </div>
  );
};
