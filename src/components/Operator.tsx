import { ReactElement, useState } from "react";

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
  ineffectiveAmps: Array<boolean>;
  ineffectivePitches: Array<boolean>;
  otherOps: Array<{ name: string, amps: Array<number>, pitches: Array<number>}>;
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
  otherOps,
  highAmpWarning,
}: Props): ReactElement => {

  const [showExtraOptions, setShowExtraOptions] = useState<boolean>(false);

  const classes = ["op", showExtraOptions && 'show-extra-options']
    .filter((t) => t)
    .join(" ");

  const copyFromOtherOp = (amps: Array<number>, pitches: Array<number>) => {
    setAmpValues(amps);
    setPitchValues(pitches);
  }

  const clearOp = () => {
    setAmpValues(new Array(ampValues.length).fill(0));
    setPitchValues(new Array(pitchValues.length).fill(0));
  }

  const extraOptionsLabel = showExtraOptions ? '<' : '>';

  return (
    <div id={id} className={classes}>
      <div className="header">
        <div className="label">{label}</div>
        <button onClick={() => setShowExtraOptions(!showExtraOptions)}>{ extraOptionsLabel }</button>
      </div>
      <div className="extra-options">
        <button onClick={() => clearOp()}>Clear</button>
        { otherOps.map(op => (
            <button key={op.name} onClick={() => copyFromOtherOp(op.amps, op.pitches)}>
              Copy from {op.name}
            </button>
        ))}
      </div>

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
