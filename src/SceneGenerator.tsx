import { randomBetween, randomInt } from "./Random";
import { Scene, SceneArea, SceneObject } from "./Shape";
import { Point } from "./Vector";
import range from 'lodash.range';
import { Road } from "./generators/Road";
import { SceneObjects } from "./generators/SceneObjects";
import { Texture } from "./Textures";


const ROAD_EDGE_OVERHANG = 100;

const randomEdgePoint = (dim: Point): Point => {
    let pos = randomInt((dim[0] + dim[1]) * 2);
    if (pos < dim[0]) {
        return [pos, -ROAD_EDGE_OVERHANG];
    }
    pos -= dim[0];
    if (pos < dim[1]) {
        return [dim[0] + ROAD_EDGE_OVERHANG, pos];
    }
    pos -= dim[1];
    if (pos < dim[0]) {
        return [pos, dim[1] + ROAD_EDGE_OVERHANG];
    }
    pos -= dim[0];
    return [-ROAD_EDGE_OVERHANG, pos];
}

export const SceneGenerator = {
    create: (dim: Point, baseTexture: string): Scene => ({
        layers: {
            base: {
                areas: [{
                    vertices: [[0, 0], [dim[0], 0], dim, [0, dim[1]]],
                    texture: {
                        name: baseTexture,
                    },
                }],
                type: 'base'
            }
        },
        shadowVector: [0, 0],
        size: dim
    }),
    roads: (scene: Scene, layer: string, mainWidth: number, sideRoads: Array<number>, texture: Texture): Scene => {
        const dim = scene.size;

        const mainEndpoints: Array<{ from: Point, width: number }> = [
            { from: [-ROAD_EDGE_OVERHANG, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: mainWidth },
            { from: [dim[0] + ROAD_EDGE_OVERHANG, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: mainWidth }
        ];

        const extraEndpoints = sideRoads.map(width => ({
            from: randomEdgePoint(dim),
            width: width
        }));

        scene.layers[layer] = {
            areas: Road.generate([...mainEndpoints, ...extraEndpoints], {
                name: texture.name
            }),
            type: 'road'
        }

        return scene;
    },
    objects: (scene: Scene, layer: string, count: number, texture: Texture): Scene => {
        const currentObjects: Array<SceneObject> = scene.layers[layer]?.objects ?? [];
        const roadAreas: Array<SceneArea> = scene.layers.road.areas ?? [];
        const newObjects = SceneObjects.generate(scene.size, currentObjects, count, texture.height, texture.radius, {
            name: texture.name,
        }, roadAreas);
        scene.layers[layer] = {
            objects: currentObjects.concat(newObjects),
            type: 'object'
        }
        return scene;
    }
}
