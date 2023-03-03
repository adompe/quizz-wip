export function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}

export function pointsDist(pos, pos2) {
  return Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
}

export function linePointColl(x1, y1, x2, y2, px, py) {
  // get distance from the point to the two ends of the line
  const d1 = pointsDist({ x: px, y: py }, { x: x1, y: y1 });
  const d2 = pointsDist({ x: px, y: py }, { x: x2, y: y2 });

  // get the length of the line
  const lineLen = pointsDist({ x: x1, y: y1 }, { x: x2, y: y2 });

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  const buffer = 0.1; // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}

export function pointCircleColl(px, py, cx, cy, r) {
  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  const distX = px - cx;
  const distY = py - cy;
  const distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
}

export function lineCircleColl(x1, y1, x2, y2, cx, cy, r) {
  // is either end INSIDE the circle?
  // if so, return true immediately
  const inside1 = pointCircleColl(x1, y1, cx, cy, r);
  const inside2 = pointCircleColl(x2, y2, cx, cy, r);
  if (inside1 || inside2) return true;

  // get length of the line
  let distX = x1 - x2;
  let distY = y1 - y2;
  const len = Math.sqrt(distX * distX + distY * distY);

  // get dot product of the line and circle
  const dot =
    ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(len, 2);

  // find the closest point on the line
  const closestX = x1 + dot * (x2 - x1);
  const closestY = y1 + dot * (y2 - y1);

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  const onSegment = linePointColl(x1, y1, x2, y2, closestX, closestY);
  if (!onSegment) return false;

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  const distance = Math.sqrt(distX * distX + distY * distY);

  if (distance <= r) {
    return true;
  }
  return false;
}
