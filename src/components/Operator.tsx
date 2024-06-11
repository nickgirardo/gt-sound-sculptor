import { ReactElement } from "react";

import { AmpControl } from "./AmpControl";
import { PitchControl } from "./PitchControl";

import "../scss/operator.css";

interface Props {
  id: string;
  label: string;
  ampValues: Array<number>;
  setAmpValues: React.Dispatch<React.SetStateAction<Array<number>>>;
  pitchValues: Array<number>;
  setPitchValues: React.Dispatch<React.SetStateAction<Array<number>>>;
  ampWarning?: string;
}

export const Operator = ({
  id,
  label,
  ampValues,
  setAmpValues,
  pitchValues,
  setPitchValues,
  ampWarning,
}: Props): ReactElement => {
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
