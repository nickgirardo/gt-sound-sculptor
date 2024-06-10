import { ReactElement } from "react";

import { AmpControl } from "./AmpControl";
import { PitchControl } from "./PitchControl";

import "../scss/operator.css";

interface Props {
  id: string;
  label: string;
  count: number;
}

export const Operator = ({ id, label, count }: Props): ReactElement => {
  return (
    <div id={id} className="op">
      <div className="label">{label}</div>
      <div className="controls">
        <AmpControl count={count} />
        <PitchControl count={count} />
      </div>
    </div>
  );
};
