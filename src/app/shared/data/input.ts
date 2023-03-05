export function readXY(data: string): { x: number[], y: number[] } {
  const lines = data.split('\n');
  let x: number[] = [];
  let y: number[] = [];
  lines.forEach((line) => {
    if (line.length > 0 && line[0] !== '#' && line[0] !== '@') {
      const values = line.trim().split(/\s+/g);
      const  xValue = parseFloat(values[0]);
      const  yValue = parseFloat(values[1]);
      if (!isNaN(xValue) && !isNaN(yValue) && values.length === 2) {
        x.push(xValue);
        y.push(yValue);
      }
    }
  });
  if (x.length !== y.length) {
    throw new Error("Invalid data");
  } else if (x.length === 0 || y.length === 0) {
    throw new Error("Empty data");
  }
  return {x, y};
}
