import { Point } from "./Vector";

export interface SceneObject {
    origin: Point;
    orientation: number;
    radius: number;
    height: number;
    texture: SceneTexture;
}

export interface SceneArea {
    vertices: Array<Point>;
    texture: SceneTexture;
    stretch?: boolean;
}

export interface SceneTexture {
    name: string;
    scale?: number;
    rotate?: number;
}

export interface Scene {
    size: Point;
    layers: Record<string, SceneLayer>;
    shadowVector: Point;
    tint?: string;
    edgeShade?: number;
}

export interface SceneLayer {
    type: 'base' | 'road' | 'river' | 'object';
    areas?: Array<SceneArea>;
    objects?: Array<SceneObject>;
}



