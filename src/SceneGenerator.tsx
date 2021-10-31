import { randomBetween, randomInt } from "./Random";
import { Scene, SceneArea, SceneObject } from "./Shape";
import { Point } from "./Vector";
import range from 'lodash.range';
import { Road } from "./generators/Road";
import { SceneObjects } from "./generators/SceneObjects";
import { Texture } from "./Textures";


const randomEdgePoint = (dim: Point): Point => {
    let pos = randomInt((dim[0] + dim[1]) * 2);
    if (pos < dim[0]) {
        return [pos, 0];
    }
    pos -= dim[0];
    if (pos < dim[1]) {
        return [dim[0], pos];
    }
    pos -= dim[1];
    if (pos < dim[0]) {
        return [pos, dim[1]];
    }
    pos -= dim[0];
    return [0, pos];
}


export const generateScene = (roads: number, objects: Array<{ texture: Texture, count: number }>, dim: Point, shadowVector: Point): Scene => {

    const scene: Scene = {
        areas: [],
        objects: [],
        shadowVector
    };

    scene.areas.push({
        vertices: [[0, 0], [dim[0], 0], dim, [0, dim[1]]],
        texture: {
            name: 'grass',
        },
    });

    const roadAreas: Array<SceneArea> = [];

    if (roads) {
        const mainEndpoints: Array<{ from: Point, width: number }> = [
            { from: [0, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: dim[1] / 40 },
            { from: [dim[0], randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: dim[1] / 40 }
        ]

        const extraEndpointsCount = randomInt(roads / 5);
        const extraEndpoints: Array<{ from: Point, width: number }> = range(0, extraEndpointsCount).map(() => ({
            from: randomEdgePoint(dim),
            width: randomBetween(5, roads * 2)
        }));

        Road.generate([...mainEndpoints, ...extraEndpoints], {
            name: 'gravel',
        }).forEach(shape => roadAreas.push(shape));
    }
    roadAreas.forEach(shape => scene.areas.push(shape));

    let sceneObjects: Array<SceneObject> = [];
    objects.forEach(ob => {
        const newObjects = SceneObjects.generate(dim, sceneObjects, ob.count, ob.texture.height, ob.texture.radius, {
            name: ob.texture.name,
        }, roadAreas);
        sceneObjects = sceneObjects.concat(sceneObjects, newObjects);
    })

    sceneObjects.forEach(shape => scene.objects.push(shape));

    return scene;
}