import { randomBetween } from "../Random";
import { SceneArea, SceneObject, SceneTexture } from "../Scene";
import { Point, lineLength } from "../Vector";

declare const OffscreenCanvas: any;

const MAX_TRIES = 1000;

const placeObject = (dim: Point, avoid: Array<SceneObject>, radius: number, tries: number): Point | null => {
    let tried = 0;
    while (tried++ < tries) {
        const candidate: Point = [randomBetween(0, dim[0]), randomBetween(0, dim[1])];
        const farEnough = avoid.every(ob => lineLength(ob.origin, candidate) > radius + ob.radius);
        if (farEnough) {
            return candidate;
        }
    }
    return null;
}

const spreadObjects = (dim: Point, avoid: Array<SceneObject>, count: number, height: number, radius: number, texture: SceneTexture): Array<SceneObject> => {

    let ret: Array<SceneObject> = [];

    for (let i = 0; i < count; i++) {
        const newPoint = placeObject(dim, ret.concat(avoid), radius, MAX_TRIES);
        if (newPoint === null) {
            console.warn(`stopped object generation at ${i}, too many tries`);
            break;
        }
        ret.push({
            origin: newPoint,
            orientation: randomBetween(0, 2 * Math.PI),
            height,
            radius,
            texture
        });
    }
    return ret;
}

const inShapeFactory = (shape: SceneArea): ((point: Point) => boolean) => {

    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    const path: Path2D = new Path2D();
    path.moveTo(...shape.vertices[0]);
    shape.vertices.slice(1).forEach(vertex => {
        path.lineTo(...vertex);
    });
    path.closePath();
    return point => context.isPointInPath(path, ...point);
}

export const SceneObjects = {
    generate: (dim: Point, avoid: Array<SceneObject>, count: number, height: number, radius: number, texture: SceneTexture, exclude: Array<SceneArea> = []): Array<SceneObject> => {
        const shapeChecker = exclude.map(inShapeFactory);

        return spreadObjects(dim, avoid, count, height, radius, texture).filter(ob => shapeChecker.every(sc => !sc(ob.origin)));
    }

}