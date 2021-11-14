import { randomBetween, randomInt, randomPlusMinus } from "../Random";
import { SceneArea, SceneTexture } from "../Scene";
import { Point, lineLength, lineNormal, add, stretch, invert, relative, intersection, subtract } from "../Vector";

const SPLIT_MIN = 0.2;
const SPLIT_MAX = 0.8;
const BENDINESS = 1 / 10;
const SPLITS = 1000;
const MINIMUM_SPLIT_LENGTH = 0.01;

const splitLine = (from: Point, to: Point): Point | null => {
    const splitRatio = randomBetween(SPLIT_MIN, SPLIT_MAX);
    const length = lineLength(from, to);
    if (length < MINIMUM_SPLIT_LENGTH) {
        return null;
    }
    const lineVector = relative(from, to);
    const splitPoint = add(from, stretch(lineVector, splitRatio));

    const normal = lineNormal(from, to);
    const perturbation = stretch(normal, randomPlusMinus(length * BENDINESS));

    return add(splitPoint, perturbation);
}

const intersect = (line: [Point, Point], area: SceneArea): Array<number> => {
    const ret: Array<number> = [];
    for (let i = 0; i < area.vertices.length; i++) {
        const p1 = area.vertices[i];
        const p2 = area.vertices[(i + 1) % area.vertices.length];
        const fraction = intersection(line, [p1, p2]);
        if (fraction !== null) {
            console.log('line ' + JSON.stringify(line) + ' intersecting at ' + fraction);
            ret.push(fraction);
        }
    }
    return ret;
}

const createRectangle = (from: Point, to: Point, width: number, texture: SceneTexture): SceneArea => {
    const widthAdjustment = stretch(lineNormal(from, to), width / 2);
    const centerline: Array<Point> = [from, to];
    const topLine: Array<Point> = centerline.map(vertex => add(vertex, invert(widthAdjustment)));
    const bottomLine: Array<Point> = centerline.reverse().map(vertex => add(vertex, widthAdjustment));
    return {
        vertices: [...topLine, ...bottomLine],
        texture,
        stretch: true
    };
}

const generateRoad = (from: Point, to: Point, width: number, texture: SceneTexture, river?: SceneArea): Array<SceneArea> => {
    const widthAdjustment = stretch(lineNormal(from, to), width / 2);

    const centerline: Array<Point> = [from, to];

    if (river) {
        const intersectionPoints = intersect(centerline as [Point, Point], river);
        intersectionPoints.sort((a, b) => a - b);
        if (intersectionPoints.length === 2) {
            const bridge1 = add(from, stretch(subtract(to, from), intersectionPoints[0]));
            const bridge2 = add(from, stretch(subtract(to, from), intersectionPoints[1]));
            return [
                ...generateRoad(from, bridge1, width, texture),
                ...generateRoad(bridge2, to, width, texture),
                createRectangle(bridge1, bridge2, width, {
                    name: 'bridge'
                })
            ];
        }
    }

    for (let i = 0; i < SPLITS; i++) {
        const idx = randomInt(centerline.length - 1) + 1;
        const split = splitLine(centerline[idx - 1], centerline[idx]);
        if (split) {
            centerline.splice(idx, 0, split);
        }
    }

    const topLine: Array<Point> = centerline.map(vertex => add(vertex, invert(widthAdjustment)));
    const bottomLine: Array<Point> = centerline.reverse().map(vertex => add(vertex, widthAdjustment));
    return [{
        vertices: [...topLine, ...bottomLine],
        texture
    }];
}

const generateRoads = (endpoints: Array<{ from: Point, width: number }>, texture: SceneTexture, river?: SceneArea): Array<SceneArea> => {
    if (endpoints.length > 2) {
        const midpoint = endpoints.reduce((acc, curr) => [acc[0] + curr.from[0] / endpoints.length, acc[1] + curr.from[1] / endpoints.length] as Point, [0, 0] as Point);
        return endpoints.flatMap(ep => generateRoad(ep.from, midpoint, ep.width, texture, river));
    } else {
        console.log('clean cut');
        return generateRoad(endpoints[0].from, endpoints[1].from, endpoints[0].width, texture, river);
    }

}


export const Road = {
    generate: generateRoads,
}


