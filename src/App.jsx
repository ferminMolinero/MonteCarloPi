import "./App.css";
import { useEffect, useState } from "react";
import { MonteCarlo } from "./components/MonteCarlo";
function App() {
  const [play, setPlay] = useState(true);
  const [speed, setSpeed] = useState(1000);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handlePlay = () => {
    setPlay(!play);
  };
  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  return (
    <section className="app">
      <section className="board simulation">
        <MonteCarlo
          speed={speed}
          play={play}
          width={0.55 * width}
          height={0.75 * height}
        />
      </section>
      <section className="board control">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
            marginTop: "40px",
          }}
        >
          <label htmlFor="speed" style={{ fontWeight: "bold", color: "white" }}>
            Number of milliseconds per iteration
          </label>
          <input
            type="number"
            value={speed}
            onChange={handleSpeedChange}
            id="speed"
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              textAlign: "center",
            }}
          />
          <button
            onClick={handlePlay}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: play ? "#f44336" : "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            {play ? "Pause" : "Play"}
          </button>
        </div>
      </section>
    </section>
  );
}

export default App;
