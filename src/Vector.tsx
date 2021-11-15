export type Point = [number, number];

export const lineLength = (from: Point, to: Point = [0, 0]): number => Math.sqrt((from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]));

export const normalize = (vector: Point): Point => {
    const len = lineLength([0, 0], vector);
    return [vector[0] / len, vector[1] / len];
}

export const lineNormal = (from: Point, to: Point): Point => normalize([from[1] - to[1], to[0] - from[0]]);

export const stretch = (vector: Point, length: number): Point => [vector[0] * length, vector[1] * length];

export const add = (origin: Point, vector: Point): Point => [origin[0] + vector[0], origin[1] + vector[1]];

export const subtract = (origin: Point, vector: Point): Point => [origin[0] - vector[0], origin[1] - vector[1]];

export const relative = (origin: Point, to: Point): Point => [to[0] - origin[0], to[1] - origin[1]];

export const invert = (vector: Point): Point => [-vector[0], -vector[1]];

export const fromPolar = (magnitude: number, dir: number): Point => [Math.cos(dir) * magnitude, Math.sin(dir) * magnitude];

export const dot = (one: Point, other: Point): number => one[0] * other[0] + one[1] * other[1];

export const intersection = (a: [Point, Point], b: [Point, Point]): number | null => {

    const vectorA = subtract(a[1], a[0]);
    const vectorB = subtract(b[1], b[0]);
    const diff = subtract(a[0], b[0]);

    const ua_t = vectorB[0] * diff[1] - vectorB[1] * diff[0];
    const ub_t = vectorA[0] * diff[1] - vectorA[1] * diff[0];
    var u_b = vectorB[1] * vectorA[0] - vectorB[0] * vectorA[1];

    if (u_b !== 0) {
        const ua = ua_t / u_b;
        const ub = ub_t / u_b;

        if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            return ua;
        }
    }

    return null;
};

declare const window: any;

window.test = intersection;