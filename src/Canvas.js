import "./styles/App.css";
import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { lineCircleColl, getMousePos } from "./Utils";

function Canvas({ setCompleted, question }) {
  const canvasRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const MAX_POINT = 5;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;

  useEffect(() => {
    // getting canvas ref and context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function onMouseDown(e) {
      let pos = getMousePos(canvas, e);

      // Testing if the cursor is in the canvas
      if (
        points.length < MAX_POINT &&
        pos.x < CANVAS_WIDTH &&
        pos.y < CANVAS_HEIGHT &&
        pos.y > 0 &&
        pos.x > 0
      )
        setPoints([...points, pos]);
    }

    function onMouseMove(e) {
      if (points.length > 0 && points.length < MAX_POINT) {
        let pos = getMousePos(canvas, e);
        render();

        ctx.beginPath();
        ctx.moveTo(points.slice(-1)[0].x, points.slice(-1)[0].y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const render = () => {
      // clean canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      let completed = true;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let collide = false;

          if (points.length >= 2)
            points.forEach((point, idx) => {
              if (points[idx + 1]) {
                if (
                  lineCircleColl(
                    point.x,
                    point.y,
                    points[idx + 1].x,
                    points[idx + 1].y,
                    i * 75 + 125,
                    j * 75 + 125,
                    10
                  )
                )
                  collide = true;
              }
            });
          if (!collide) completed = false;
          // Drawing circles
          ctx.fillStyle = collide ? "#3370d4" : "#FFF";
          ctx.beginPath();
          ctx.arc(i * 75 + 125, j * 75 + 125, 10, 0, 2 * Math.PI);

          ctx.fill();
        }
      }

      if (completed && !isCompleted) {
        setIsCompleted(true);
        setCompleted();
      }

      // Drawing the lines between clicked points
      points.forEach((point, idx) => {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        if (points[idx + 1]) ctx.lineTo(points[idx + 1].x, points[idx + 1].y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    render();
    window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mousemove", onMouseMove, false);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  return (
    <div>
      <p>{question}</p>
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvasRef}
        id='drawCanvas'
        style={{
          boxShadow: "rgba(0, 0, 0, 0.50) 0px 1px 8px",
          marginTop: "15px",
        }}
      />
      <p>
        Point(s) placé(s) restant(s): {points.length}/{MAX_POINT}
        <br />
        Compléter: {isCompleted ? "✅" : "❌"}
      </p>
      <ButtonGroup
        variant='contained'
        aria-label='outlined primary button group'
      >
        <Button onClick={() => setPoints(points.slice(0, -1))}>Undo</Button>
        <Button onClick={() => setPoints([])}>Clear</Button>
      </ButtonGroup>
    </div>
  );
}

export default Canvas;
