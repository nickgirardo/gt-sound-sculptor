import { useEffect, useRef, ReactElement } from "react";

import "../scss/emulator.css";

export const GTEmulator = (): ReactElement => {

    const canvasParentRef = useRef(null);

    useEffect(() => {
        const canvas = document.getElementById("canvasContainer");
        if((canvas != null) && (canvasParentRef.current != null)) {
            canvas.parentElement?.removeChild(canvas);
            canvasParentRef.current.appendChild(canvas);
        }
    });

    return (
        <div ref={canvasParentRef}> </div>
    );
};
