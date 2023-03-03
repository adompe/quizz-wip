import "./styles/App.css";
import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { lineCircleColl, getMousePos } from "./Utils";

function CanvasIsland({ setCompleted, question }) {
  const canvasRef = useRef(null);

  const [planks, setPlanks] = useState([
    { x: 20, y: 50, rot: 45, selected: false },
    { x: 50, y: 100, rot: 45, selected: false },
  ]);
  const [completed, setIsCompleted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const MAX_POINT = 5;

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;

  const PLANK_WIDTH = 20;
  const PLANK_HEIGHT = 50;

  const selectPlank = (index) => {
    setPlanks(
      planks.map((plank, indexPlank) =>
        index === indexPlank
          ? { ...plank, selected: true }
          : { ...plank, selected: false }
      )
    );
  };

  const rotatePlank = (rot) => {
    setPlanks(
      planks.map((plank, indexPlank) =>
        plank.selected ? { ...plank, rot: (plank.rot += rot) } : plank
      )
    );
  };

  const getPositionAngle = (position, degree, relativePos) => {
    let s = Math.sin(degree * (Math.PI / 180));
    let c = Math.cos(degree * (Math.PI / 180));

    let tmpX = position.x - (relativePos.x + PLANK_WIDTH / 2);
    let tmpY = position.y - (relativePos.y + PLANK_HEIGHT / 2);

    let newX = tmpX * c - tmpY * s;
    let newY = tmpX * s + tmpY * c;

    return {
      x: newX + (relativePos.x + PLANK_WIDTH / 2),
      y: newY + (relativePos.y + PLANK_HEIGHT / 2),
    };
  };

  useEffect(() => {
    // getting canvas ref and context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function checkCompleted() {
      let completed = false;
      planks.forEach((plank) => {
        let plankTopCenterPosWithAngle = getPositionAngle(
          { x: plank.x + PLANK_WIDTH / 2, y: plank.y },
          plank.rot,
          { x: plank.x, y: plank.y }
        );
        if (
          plankTopCenterPosWithAngle.x > 150 &&
          plankTopCenterPosWithAngle.x < 150 + 100 &&
          plankTopCenterPosWithAngle.y > 150 &&
          plankTopCenterPosWithAngle.y < 150 + 100
        )
          alert("okok");
      });
    }

    function onMouseDown(e) {
      let mousePos = getMousePos(canvas, e);
      let plankSelectedIndex = null;

      planks.forEach((plank, indexPlank) => {
        let mouseOffsetAngle = getPositionAngle(mousePos, -plank.rot, {
          x: plank.x,
          y: plank.y,
        });
        if (
          mouseOffsetAngle.x > plank.x &&
          mouseOffsetAngle.y > plank.y &&
          mouseOffsetAngle.x < plank.x + PLANK_WIDTH &&
          mouseOffsetAngle.y < plank.y + PLANK_HEIGHT
        ) {
          plankSelectedIndex = indexPlank;
          setDragging(true);
        }
      });

      if (plankSelectedIndex != null) {
        setPlanks(
          planks.map((plank, indexPlank) =>
            indexPlank === plankSelectedIndex
              ? { ...plank, selected: true }
              : { ...plank, selected: false }
          )
        );
      }
    }

    function onMouseMove(e) {
      let mousePos = getMousePos(canvas, e);

      if (dragging) {
        setPlanks(
          planks.map((plank) => {
            return plank.selected
              ? {
                  ...plank,
                  x: mousePos.x,
                  y: mousePos.y,
                }
              : plank;
          })
        );
      }
    }

    function onMouseUp(e) {
      if (dragging) setDragging(false);
      console.log(dragging);
    }

    const render = () => {
      // clean canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      let completed = false;

      // ext rect
      ctx.strokeStyle = "green";
      ctx.strokeRect(100, 100, 200, 200);

      ctx.fillStyle = "#3370d4";
      ctx.fillRect(150, 150, 100, 100);

      // planks
      planks.forEach((plank) => {
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = plank.selected ? "green" : "red";
        ctx.translate(plank.x + PLANK_WIDTH / 2, plank.y + PLANK_HEIGHT / 2);
        ctx.rotate((plank.rot * Math.PI) / 180);
        ctx.fillRect(
          -PLANK_WIDTH / 2,
          -PLANK_HEIGHT / 2,
          PLANK_WIDTH,
          PLANK_HEIGHT
        );
        ctx.restore();

        ctx.beginPath();
        ctx.fillStyle = "aqua";
        ctx.arc(
          plank.x + PLANK_WIDTH / 2,
          plank.y + PLANK_HEIGHT / 2,
          3,
          0,
          2 * Math.PI
        );
        ctx.fill();

        let newPointAnglwe = getPositionAngle(
          { x: plank.x + PLANK_WIDTH / 2, y: plank.y },
          plank.rot,
          { x: plank.x, y: plank.y }
        );

        let newPointAnglwe2 = getPositionAngle(
          { x: plank.x + PLANK_WIDTH / 2, y: plank.y + PLANK_HEIGHT },
          plank.rot,
          { x: plank.x, y: plank.y }
        );

        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(newPointAnglwe.x, newPointAnglwe.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(newPointAnglwe2.x, newPointAnglwe2.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      if (completed) {
        setIsCompleted(true);
        setCompleted();
      }
    };

    checkCompleted();
    render();
    window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mouseup", onMouseUp, false);
    window.addEventListener("mousemove", onMouseMove, false);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [planks, setCompleted, dragging]);

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
        Point(s) placé(s) restant(s): {planks.length}/{MAX_POINT}
        <br />
        Compléter: {completed ? "✅" : "❌"}
      </p>
      <ButtonGroup
        variant='contained'
        aria-label='outlined primary button group'
      >
        <Button onClick={() => rotatePlank(-45)}>-45°</Button>
        <Button onClick={() => rotatePlank(+45)}>+45°</Button>
      </ButtonGroup>
    </div>
  );
}

export default CanvasIsland;
