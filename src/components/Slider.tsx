import { MouseEventHandler, ReactElement } from "react";

import "../scss/slider.css";

interface Props {
  value: number;
  setValue: (value: number) => void;
  possibleValues: number;
  pxPerValue: number;
  isIneffective: boolean;
  warning?: boolean;
  className?: string;
}

export const Slider = ({
  value,
  setValue,
  possibleValues,
  pxPerValue,
  isIneffective,
  warning,
  className,
}: Props): ReactElement => {
  const totalHeight = pxPerValue * possibleValues;

  const mouseHandler: MouseEventHandler<HTMLDivElement> = (ev) => {
    if (ev.buttons !== 1) return;

    let slider = ev.target! as HTMLDivElement;

    while (!slider.classList.contains("slider") || !slider)
      slider = slider.parentElement! as HTMLDivElement;

    if (!slider) throw new Error("Unable to find slider :(");

    const fillValue = ev.clientY - slider.getBoundingClientRect().top;

    setValue(Math.round((totalHeight - fillValue) / pxPerValue));
  };

  // NOTE just hacking this in here instead of using a library like "classnames"
  // because this is the only place in the application I need to do this
  const classes = ["slider", className, warning && "warning", isIneffective && "ineffective"]
    .filter((t) => t)
    .join(" ");

  return (
    <div
      className={classes}
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
