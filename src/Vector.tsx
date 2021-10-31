export type Point = [number, number];

export const lineLength = (from: Point, to: Point = [0, 0]): number => Math.sqrt((from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]));

export const normalize = (vector: Point): Point => {
    const len = lineLength([0, 0], vector);
    return [vector[0] / len, vector[1] / len];
}

export const lineNormal = (from: Point, to: Point): Point => normalize([from[1] - to[1], to[0] - from[0]]);

export const stretch = (vector: Point, length: number): Point => [vector[0] * length, vector[1] * length];

export const add = (origin: Point, vector: Point): Point => [origin[0] + vector[0], origin[1] + vector[1]];

export const relative = (origin: Point, to: Point): Point => [to[0] - origin[0], to[1] - origin[1]];

export const invert = (vector: Point): Point => [-vector[0], -vector[1]];

export const fromPolar = (magnitude: number, dir: number): Point => [Math.cos(dir) * magnitude, Math.sin(dir) * magnitude];