import { ForwardedRef, ReactElement, forwardRef } from "react";

import "../scss/emulator.css";

export const GTEmulator = forwardRef(
  (_props, ref: ForwardedRef<HTMLIFrameElement>): ReactElement => {
    return (
      <iframe
        ref={ref}
        className="emulator"
        src="/emulator.html"
        width="512"
        height="32"
      />
    );
  },
);
