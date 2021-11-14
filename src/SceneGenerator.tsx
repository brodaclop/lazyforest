import { randomBetween, randomInt } from "./Random";
import { Scene, SceneArea, SceneObject, SceneTexture } from "./Scene";
import { Point } from "./Vector";
import { Road } from "./generators/Road";
import { SceneObjects } from "./generators/SceneObjects";
import { Texture } from "./Textures";


const ROAD_EDGE_OVERHANG = 2;

const randomEdgePoint = (dim: Point): Point => {
    const side = randomInt(4);
    const chosenDim = dim[side % 2]; // width if side is even, height if side is odd;
    const pos = randomBetween(chosenDim * 0.1, chosenDim * 0.9);

    switch (side) {
        case 0: return [pos, -ROAD_EDGE_OVERHANG];
        case 1: return [dim[0] + ROAD_EDGE_OVERHANG, pos];
        case 2: return [pos, dim[1] + ROAD_EDGE_OVERHANG];
        case 3: return [-ROAD_EDGE_OVERHANG, pos];
        default: throw new Error('randomInt(4) returned a weird value');
    }
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
    river: (scene: Scene, layer: string, mainWidth: number, texture: Texture): Scene => {
        const dim = scene.size;

        const mainEndpoints: Array<{ from: Point, width: number }> = [
            { from: [randomBetween(0.1 * dim[0], 0.9 * dim[0]), -ROAD_EDGE_OVERHANG], width: mainWidth },
            { from: [randomBetween(0.1 * dim[0], 0.9 * dim[0]), dim[1] + ROAD_EDGE_OVERHANG], width: mainWidth }
        ];

        scene.layers[layer] = {
            areas: Road.generate(mainEndpoints, {
                name: texture.name
            }),
            type: 'river'
        };

        return scene;
    },
    roads: (scene: Scene, layer: string, mainWidth: number, sideRoads: Array<number>, texture: Texture, bridgeTexture?: Texture, river?: SceneArea): Scene => {
        const dim = scene.size;

        let mainEndpoints: Array<{ from: Point, width: number }> = [
            { from: [-ROAD_EDGE_OVERHANG, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: mainWidth },
            { from: [dim[0] + ROAD_EDGE_OVERHANG, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: mainWidth }
        ];

        const extraEndpoints = sideRoads.map(width => ({
            from: randomEdgePoint(dim),
            width: width
        }));

        const bridge: SceneTexture | undefined = bridgeTexture && {
            name: bridgeTexture.name
        };

        scene.layers[layer] = {
            areas: Road.generate([...mainEndpoints, ...extraEndpoints], {
                name: texture.name
            },
                bridge,
                river),
            type: 'road'
        };

        return scene;
    },
    objects: (scene: Scene, layer: string, count: number, texture: Texture): Scene => {
        const currentObjects: Array<SceneObject> = scene.layers[layer]?.objects ?? [];
        const roadAreas: Array<SceneArea> = [...scene.layers.road.areas ?? [], ...scene.layers.river.areas ?? []];
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
