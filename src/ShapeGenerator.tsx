import { randomBetween, randomInt, randomPlusMinus } from "./Random";
import { lineLength, lineNormal, add, stretch, invert, Point, relative } from "./Vector";

export interface LineSegment {
    type: 'line';
    to: Point;
}

export interface QuadraticSegment {
    type: 'quadratic';
    to: Point;
    control: Point;
}

export type Segment = LineSegment | QuadraticSegment;

export interface Shape {
    origin: Point;
    appearance: ShapeAppearance;
    segments: Array<Segment>
}

export interface ShapeAppearance {
    texture: string;
    type: 'tiled' | 'single';
    scale?: number;
    rotate?: number;
}

const splitLine = (from: Point, to: Point): Point => {
    const splitRatio = randomBetween(0.2, 0.8);
    const length = lineLength(from, to);
    const normal = lineNormal(from, to);
    const lineVector = relative(from, to);
    const splitPoint = add(from, add(stretch(lineVector, splitRatio), stretch(normal, randomPlusMinus(length / 10))));

    return splitPoint;
}

export const generateRoad = (from: Point, to: Point, width: number, appearance: Omit<ShapeAppearance, 'type'>): Shape => {
    const SPLITS = 400;
    const widthAdjustment = stretch(lineNormal(from, to), width);

    const centerline: Array<Point> = [from, to];

    for (let i = 0; i < SPLITS; i++) {
        const idx = randomInt(centerline.length - 1) + 1;
        const split = splitLine(centerline[idx - 1], centerline[idx]);
        centerline.splice(idx, 0, split);
    }

    const topLine: Array<LineSegment> = centerline.map(line => ({
        type: 'line',
        to: add(line, invert(widthAdjustment))
    }));
    const bottomLine: Array<LineSegment> = centerline.reverse().map(line => ({
        type: 'line',
        to: add(line, widthAdjustment)
    }));
    return {
        origin: add(from, invert(widthAdjustment)),
        segments: [...topLine, ...bottomLine],
        appearance: {
            ...appearance,
            type: 'tiled'
        }
    };
}

export const generateIntersection = (endpoints: Array<{ from: Point, width: number }>, appearance: Omit<ShapeAppearance, 'type'>): Array<Shape> => {
    const midpoint = endpoints.reduce((acc, curr) => [acc[0] + curr.from[0] / endpoints.length, acc[1] + curr.from[1] / endpoints.length] as Point, [0, 0] as Point);
    return endpoints.map(ep => generateRoad(ep.from, midpoint, ep.width, appearance));
}
