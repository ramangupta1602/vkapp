import * as d3 from "d3-shape";

export const getStartingQuatrePath = (x, y, radius) => {
  // it return path for full semicircle, if we return 2 points then it will become quater path
  const data = getDiscretPointForLeftSemicircle(radius, x, y, 0);

  data.splice(0, 3);

  data.unshift([x - radius, y + radius - 20]);

  const curve = d3.line().curve(d3.curveBasis)(data);

  const path = `${curve}`;
  return path;
};

/**
 * curveOffset basically shorter the straight line so that
 * curving can start from little behind
 */
export const getFullPath = ({
  month,
  straightLineLength,
  innerRadius,
  outerRadius,
  offset,
  curveOffset,
}) => {
  let path = "";
  let previousY = 0;

  for (let i = 0; i < month; ++i) {
    if (i % 2 === 0) {
      path += getEvenPath(
        75,
        previousY + offset,
        straightLineLength,
        outerRadius,
        curveOffset
      );
      previousY += 2 * outerRadius;
    } else {
      path += getOddPath(
        75,
        previousY + offset,
        straightLineLength,
        innerRadius,
        curveOffset
      );

      previousY += 2 * innerRadius;
    }
  }

  return path;
};

export const getEvenPath = (x, y, length, radius, curveOffset) => {
  const data = getDiscretPointForRightSemicircle(
    radius,
    x + length,
    y,
    curveOffset
  );
  const curve = d3.line().curve(d3.curveBasis)(data);

  const p1 = `M${x},${y} L${x + length},${y}`;

  const path = `${p1} ${curve}`;
  return path;
};

export const getOddPath = (x, y, length, radius, curveOffset) => {
  const data = getDiscretPointForLeftSemicircle(radius, x, y, curveOffset);
  const curve = d3.line().curve(d3.curveBasis)(data);
  const p2 = `M${x + length},${y} L${x} ${y}`;

  const path = `${p2} ${curve} `;
  return path;
};

export const getDiscretPointForRightSemicircle = (
  radius,
  x,
  y,
  curveOffset
) => {
  const x1 = x + curveOffset;
  const y1 = y;
  const x2 = x + curveOffset;
  const y2 = y + 2 * radius;

  const x45 = Math.round(radius * Math.cos(Math.PI / 4)) + x;
  const y45 = radius - Math.round(radius * Math.sin(Math.PI / 4)) + y;
  const xn45 = Math.round(radius * Math.cos(-Math.PI / 4)) + x;
  const yn45 = radius - Math.round(radius * Math.sin(-Math.PI / 4)) + y;

  const point = [
    [x, y],
    [x1, y1],
    [x45, y45],
    [x + radius, y + radius],
    [xn45, yn45],
    [x2, y2],
    [x, y + 2 * radius],
  ];

  return point;
};

export const getDiscretPointForLeftSemicircle = (radius, x, y, curveOffset) => {
  const x1 = x - 10;
  const y1 = y;
  const x2 = x - 10;
  const y2 = y + 2 * radius;
  const x45 = x + Math.round(radius * Math.cos((3 * Math.PI) / 4));
  const y45 = radius - Math.round(radius * Math.sin(Math.PI / 4)) + y;
  const xn45 = x - Math.round(radius * Math.cos(-Math.PI / 4));
  const yn45 = radius - Math.round(radius * Math.sin((-3 * Math.PI) / 4)) + y;

  const point = [
    [x, y],
    [x1, y1],
    [x45, y45],
    [x - radius, y + radius],
    [xn45, yn45],
    [x2, y2],
    [x, y + 2 * radius],
  ];

  return point;
};

export const extractPathData = (total, leaderProperty, height, startAfter) => {
  const pathSegmentArray = [];

  let { x: previousX, y: previousY } = leaderProperty.getPropertiesAtLength(0);

  for (let i = startAfter; i <= total + startAfter; ++i) {
    const leaderSegment = (i / total) * leaderProperty.getTotalLength();

    const { x: lx, y: ly } = leaderProperty.getPropertiesAtLength(
      leaderSegment
    );

    const diffX = lx - previousX;
    const diffY = ly - previousY;

    previousX = lx;
    previousY = ly;

    const angleForOuterContourLine = Math.atan2(diffY, diffX);
    const angleForInnerContourLine = Math.PI - angleForOuterContourLine;

    const ox = lx + height * Math.sin(angleForOuterContourLine);
    const oy = ly - height * Math.cos(angleForOuterContourLine);
    const ix = lx - height * Math.sin(angleForInnerContourLine);
    const iy = ly - height * Math.cos(angleForInnerContourLine);

    const point = {
      outer: { x: ox, y: oy },
      leader: { x: lx, y: ly },
      inner: {
        x: ix,
        y: iy,
      },
    };
    pathSegmentArray.push(point);
  }

  return pathSegmentArray;
};

export const getPointAtLocation = ({
  length,
  segmentArray,
  granularity,
  height,
}) => {
  const point = segmentArray[Math.floor(length * granularity)];

  if (!point) {
    return { x: -100, y: -100 };
  }

  let {
    leader: { x, y },
  } = point;
  x -= 31; // 62 is width of batches... should be received
  y -= height; // 70 is height of batches... should be received
  return { x, y };
};

export const calculateProgressArea = (progress, pathSegment) => {
  const forwardArray = [];
  const backwardArray = [];

  let point = pathSegment[0];
  forwardArray.push(point.outer);
  backwardArray.push(point.inner);

  for (let i = 1; i <= progress; ++i) {
    point = pathSegment[i];
    forwardArray.push(point.outer);
    backwardArray.push(point.inner);
  }

  backwardArray.reverse();
  const allPoint = [...forwardArray, ...backwardArray, forwardArray[0]];

  const area = d3
    .area()
    .x1((x) => {
      return x.x;
    })
    .y1((y) => {
      return y.y;
    })
    .y0(allPoint[0].y)
    .x0(allPoint[0].x);

  return area(allPoint);
};
