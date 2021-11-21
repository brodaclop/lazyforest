import { randomBetween, randomInt } from "./Random";
import { Scene, SceneArea, SceneObject } from "./Scene";
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
                    texture: baseTexture,
                }],
                type: 'base'
            },
        },
        shadowVector: [0, 0],
        size: dim
    }),
    river: (scene: Scene, layer: string, mainWidth: number, texture: Texture, bankTexture: Texture, bankPercentage: number, bankOverhang: number): Scene => {
        const dim = scene.size;

        const mainEndpoints: Array<{ from: Point, width: number }> = [
            { from: [randomBetween(0.1 * dim[0], 0.9 * dim[0]), -ROAD_EDGE_OVERHANG], width: mainWidth },
            { from: [randomBetween(0.1 * dim[0], 0.9 * dim[0]), dim[1] + ROAD_EDGE_OVERHANG], width: mainWidth }
        ];

        scene.layers[layer] = {
            areas: Road.generate(mainEndpoints, texture.name).map(area => {
                if (bankTexture && (bankPercentage || bankOverhang)) {
                    area.edge = {
                        texture: bankTexture.name,
                        width: [- mainWidth * bankOverhang / 200, mainWidth * bankPercentage / 200],
                    };
                }
                return area;
            }),
            type: 'river'
        };

        return scene;
    },
    roads: (scene: Scene, layer: string, mainWidth: number, sideRoads: Array<number>, texture: Texture, bridgeTexture: Texture | undefined, vergeTexture: Texture | undefined, vergePercentage: number, vergeOverhang: number): Scene => {
        const dim = scene.size;

        const river = Object.values(scene.layers).find(layer => layer.type === 'river')?.areas?.[0];

        let mainEndpoints: Array<{ from: Point, width: number }> = [
            { from: [-ROAD_EDGE_OVERHANG, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: mainWidth },
            { from: [dim[0] + ROAD_EDGE_OVERHANG, randomBetween(0.1 * dim[1], 0.9 * dim[1])], width: mainWidth }
        ];

        const extraEndpoints = sideRoads.map(width => ({
            from: randomEdgePoint(dim),
            width: width
        }));

        scene.layers[layer] = {
            areas: Road.generate([...mainEndpoints, ...extraEndpoints], texture.name,
                bridgeTexture?.name,
                river).map(area => {
                    if (vergeTexture && (vergePercentage || vergeOverhang)) {
                        area.edge = {
                            texture: vergeTexture.name,
                            width: [- mainWidth * vergeOverhang / 200, mainWidth * vergePercentage / 200],
                        };
                    }
                    return area;
                }),
            type: 'road'
        };

        return scene;
    },
    objects: (scene: Scene, layer: string, count: number, texture: Texture): Scene => {
        const currentObjects: Array<SceneObject> = scene.layers[layer]?.objects ?? [];
        const excludeAreas: Array<SceneArea> = Object.values(scene.layers).filter(layer => layer.type === 'road' || layer.type === 'river').flatMap(layer => layer.areas ?? []);
        const newObjects = SceneObjects.generate(scene.size, currentObjects, count, texture.height, texture.radius, texture.name, excludeAreas);
        scene.layers[layer] = {
            objects: currentObjects.concat(newObjects),
            type: 'object'
        }
        return scene;
    }
}
