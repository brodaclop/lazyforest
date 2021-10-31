import { randomBetween, randomInt, randomPlusMinus } from "../Random";
import { SceneArea, SceneTexture } from "../Shape";
import { Point, lineLength, lineNormal, add, stretch, invert, relative } from "../Vector";

const splitLine = (from: Point, to: Point): Point => {
    const splitRatio = randomBetween(0.2, 0.8);
    const length = lineLength(from, to);
    const normal = lineNormal(from, to);
    const lineVector = relative(from, to);
    const splitPoint = add(from, add(stretch(lineVector, splitRatio), stretch(normal, randomPlusMinus(length / 10))));

    return splitPoint;
}

const generateRoad = (from: Point, to: Point, width: number, texture: SceneTexture): SceneArea => {
    const SPLITS = 400;
    const widthAdjustment = stretch(lineNormal(from, to), width);

    const centerline: Array<Point> = [from, to];

    for (let i = 0; i < SPLITS; i++) {
        const idx = randomInt(centerline.length - 1) + 1;
        const split = splitLine(centerline[idx - 1], centerline[idx]);
        centerline.splice(idx, 0, split);
    }

    const topLine: Array<Point> = centerline.map(vertex => add(vertex, invert(widthAdjustment)));
    const bottomLine: Array<Point> = centerline.reverse().map(vertex => add(vertex, widthAdjustment));
    return {
        vertices: [...topLine, ...bottomLine],
        texture
    };
}

const generateRoads = (endpoints: Array<{ from: Point, width: number }>, texture: SceneTexture): Array<SceneArea> => {
    const midpoint = endpoints.reduce((acc, curr) => [acc[0] + curr.from[0] / endpoints.length, acc[1] + curr.from[1] / endpoints.length] as Point, [0, 0] as Point);
    return endpoints.map(ep => generateRoad(ep.from, midpoint, ep.width, texture));
}


export const Road = {
    generate: generateRoads,
}