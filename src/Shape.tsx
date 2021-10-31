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
}

export interface SceneTexture {
    name: string;
    scale?: number;
    rotate?: number;
}

export interface Scene {
    areas: Array<SceneArea>;
    objects: Array<SceneObject>;
    shadowVector: Point;
}



