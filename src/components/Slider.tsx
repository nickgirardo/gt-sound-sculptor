import { MouseEventHandler, ReactElement } from "react";

import "../scss/slider.css";

interface Props {
  value: number;
  setValue: (value: number) => void;
  possibleValues: number;
  pxPerValue: number;
}

export const Slider = ({
  value,
  setValue,
  possibleValues,
  pxPerValue,
}: Props): ReactElement => {
  const totalHeight = pxPerValue * possibleValues;

  const mouseHandler: MouseEventHandler<HTMLDivElement> = (ev) => {
    if (ev.buttons !== 1) return;

    let slider = ev.target! as HTMLDivElement;

    while (slider.className != "slider" || !slider)
      slider = slider.parentElement! as HTMLDivElement;

    if (!slider) throw new Error("Unable to find slider :(");

    const fillValue = ev.pageY - slider.offsetTop;

    setValue(Math.round((totalHeight - fillValue) / pxPerValue));
  };

  return (
    <div
      className="slider"
      onMouseMove={mouseHandler}
      onMouseDown={mouseHandler}
      data-value={value}
    >
      <div
        className="slider-inner-off"
        style={{
          height: `${totalHeight - value * pxPerValue}px`,
        }}
      ></div>
      <div
        className="slider-inner-on"
        style={{ height: `${value * pxPerValue}px` }}
      ></div>
    </div>
  );
};
