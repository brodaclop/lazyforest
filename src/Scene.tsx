import { Point } from "./Vector";

export interface SceneObject {
    origin: Point;
    orientation: number;
    radius: number;
    height: number;
    texture: string;
}

export interface SceneArea {
    vertices: Array<Point>;
    texture: string;
    stretch?: boolean;
    edge?: {
        texture: string;
        width: [number, number];
    }
}


export interface Scene {
    size: Point;
    layers: Record<string, SceneLayer>;
    shadowVector: Point;
    tint?: string;
    edgeShade?: number;
    grid?: boolean;
}

type LayerType = 'base' | 'river' | 'road' | 'object';

export const LAYER_TYPES: Array<LayerType> = ['base', 'river', 'road', 'object'];
export interface SceneLayer {
    type: LayerType;
    areas?: Array<SceneArea>;
    objects?: Array<SceneObject>;
}



