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
  ineffectiveAmps: Array<boolean>;
  ineffectivePitches: Array<boolean>;
  setPitchValues: React.Dispatch<React.SetStateAction<Array<number>>>;
  highAmpWarning?: number;
}

export const Operator = ({
  id,
  label,
  ampValues,
  setAmpValues,
  pitchValues,
  setPitchValues,
  ineffectiveAmps,
  ineffectivePitches,
  highAmpWarning,
}: Props): ReactElement => {
  return (
    <div id={id} className="op">
      <div className="label">{label}</div>
      <div className="controls">
        <AmpControl
          onChange={setAmpValues}
          values={ampValues}
          ineffectiveAmps={ineffectiveAmps}
          highAmpWarning={highAmpWarning}
        />
        <PitchControl
          onChange={setPitchValues}
          values={pitchValues}
          ineffectivePitches={ineffectivePitches}
        />
      </div>
    </div>
  );
};
