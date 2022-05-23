import React from "react";
import { animated, to as interpolate } from "react-spring";

export function Arc({ radius, thickness, from, to }) {
  const interpolation = interpolate([from, to], (from, to) =>
    getArcProperties({ radius, thickness, from, to })
  );

  return (
    <svg
      width={2 * radius}
      height={2 * radius}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "rotate(-0.25turn)" }}
    >
      <animated.circle
        fill="none"
        cx={radius}
        cy={radius}
        strokeWidth={thickness}
        strokeLinecap="round"
        r={interpolation.to((x) => x.r)}
        strokeDashoffset={interpolation.to((x) => x.strokeDashoffset)}
        strokeDasharray={interpolation.to((x) => x.strokeDasharray.join(" "))}
      />
    </svg>
  );
}

function getArcProperties({ radius, thickness, from, to }) {
  if (from > to) [from, to] = [to, from];

  const r = radius - thickness / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = (-from / 360) * circumference;
  const strokeDasharray = [
    ((to - from) / 360) * circumference,
    (1 - (to - from) / 360) * circumference
  ];

  return {
    r,
    strokeDashoffset,
    strokeDasharray
  };
}
