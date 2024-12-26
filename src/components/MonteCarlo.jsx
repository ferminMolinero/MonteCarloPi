/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export function MonteCarlo({
  speed,
  play,
  width,
  height,
  marginBottom = 30,
  marginLeft = 30,
  marginTop = 30,
  marginRight = 30,
}) {
  const circlePoints = useRef(0);
  const squarePoints = useRef(0);
  const [iteration, setIteration] = useState([]);
  const gx = useRef(null);
  const gy = useRef(null);
  const glx = useRef(null);
  const gly = useRef(null);
  const numberPi = useRef(0);
  const [coordinates, setCoordinates] = useState([]);
  let x = 0;
  let y = 0;

  useEffect(() => {
    let interval;
    if (play === true) {
      interval = setInterval(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        x = Math.random();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        y = Math.random();
        setCoordinates((prevCoordinates) => [...prevCoordinates, { x, y }]);
        if ((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5) <= 0.25)
          circlePoints.current++;
        squarePoints.current++;
        numberPi.current = 4 * (circlePoints.current / squarePoints.current);
        setIteration((prevIteration) => [...prevIteration, numberPi.current]);
      }, speed);
    }
    return () => {
      clearInterval(interval);
      // Reset state and refs when component unmounts or dependencies change
    };
  }, [play, speed]);

  const size = Math.abs(
    Math.min(
      width - marginLeft - marginRight,
      height - marginTop - marginBottom
    )
  );

  const xscale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([marginLeft, marginLeft + size]);
  const yscale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([marginTop + size, marginTop]);
  useEffect(
    () => void d3.select(gx.current).call(d3.axisBottom(xscale)),
    [gx, xscale]
  );
  useEffect(
    () => void d3.select(gy.current).call(d3.axisLeft(yscale)),
    [gy, yscale]
  );

  const xscalelinear = d3
    .scaleLinear()
    .domain([0, iteration.length])
    .range([
      marginLeft + size + marginLeft,
      marginLeft + size + marginLeft + 0.5 * size,
    ]);
  const yscalelinear = d3
    .scaleLinear()
    .domain([3, 4])
    .range([marginTop + size, marginTop + 0.5 * size]);
  useEffect(
    () => void d3.select(glx.current).call(d3.axisBottom(xscalelinear)),
    [glx, xscalelinear]
  );
  useEffect(
    () => void d3.select(gly.current).call(d3.axisLeft(yscalelinear)),
    [gly, yscalelinear]
  );
  return (
    <>
      <svg width={width} height={height}>
        <g
          ref={gx}
          id="x-axis"
          transform={`translate(0,${height - marginBottom})`}
        ></g>
        <g ref={gy} id="y-axis" transform={`translate(${marginLeft},0)`}></g>
        <circle
          cx={xscale(0.5)}
          cy={yscale(0.5)}
          r={Math.abs(xscale(1) - xscale(0.5))}
          fill="none"
          stroke="white"
        />
        {coordinates.map((d, i) => {
          return (
            <circle
              key={i}
              cx={xscale(d.x)}
              cy={yscale(d.y)}
              r={2}
              fill={
                (d.x - 0.5) * (d.x - 0.5) + (d.y - 0.5) * (d.y - 0.5) <= 0.25
                  ? "green"
                  : "white"
              }
            />
          );
        })}
        <rect
          x={width - marginRight - 150}
          y={marginTop}
          width={160}
          height={140}
          fill="#3B3B3B"
          stroke="red"
        />
        <text x={width - marginRight - 140} y={marginTop + 20} fill="white">
          Circle Points: {circlePoints.current}
        </text>
        <text x={width - marginRight - 140} y={marginTop + 40} fill="white">
          Square Points: {squarePoints.current}
        </text>
        <text x={width - marginRight - 140} y={marginTop + 60} fill="white">
          Pi Approx: {numberPi.current.toFixed(6)}
        </text>
        <text x={width - marginRight - 140} y={marginTop + 80} fill="white">
          Pi Diff: {(Math.PI - numberPi.current).toFixed(6)}
        </text>

        <text x={width - marginRight - 140} y={marginTop + 120} fill="white">
          PI = 4 *
          <tspan x={width - marginRight - 80} dy="-0.8em">
            CircleDots
          </tspan>
          <tspan x={width - marginRight - 80} dy="1.2em">
            SquareDots
          </tspan>
        </text>
        <line
          x1={width - marginRight - 80}
          y1={marginTop + 112}
          x2={width - marginRight - 5}
          y2={marginTop + 112}
          stroke="white"
        />
        <g
          ref={glx}
          id="xl-axis"
          transform={`translate(0,${height - marginBottom})`}
        ></g>
        <g
          ref={gly}
          id="y-axis"
          transform={`translate(${marginLeft + size + marginLeft},0)`}
        ></g>
        {iteration.map((d, i) => {
          return (
            <circle
              key={i}
              cx={xscalelinear(i)}
              cy={yscalelinear(d)}
              r={1}
              fill="green"
            />
          );
        })}
        <line
          x1={xscalelinear(0)}
          y1={yscalelinear(Math.PI)}
          x2={xscalelinear(iteration.length)}
          y2={yscalelinear(Math.PI)}
          stroke="red"
        />
      </svg>
    </>
  );
}
