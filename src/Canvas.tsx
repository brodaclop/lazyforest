import React, { useEffect, useReducer, useRef } from 'react';
import gravel from './gravel.jpg';
import grass from './grass.jpg';

type Point = [number, number];

interface LineSegment {
    type: 'line';
    to: Point;
}

interface QuadraticSegment {
    type: 'quadratic';
    to: Point;
    control: Point;
}

type Segment = LineSegment | QuadraticSegment;

interface Shape {
    origin: Point;
    texture: string;
    segments: Array<Segment>
}

const ShapeDrawer = (context: CanvasRenderingContext2D, textures: Record<string, HTMLImageElement>) => {
    const shape = (shape: Shape) => {
        context.beginPath();
        context.moveTo(...shape.origin);
        shape.segments.forEach(segment => {
            if (segment.type === 'line') {
                context.lineTo(...segment.to);
            } else if (segment.type === 'quadratic') {
                const params: [number, number, number, number] = [...segment.control, ...segment.to];
                context.quadraticCurveTo(...params);
            }
        });
        context.closePath();
        context.fillStyle = context.createPattern(textures[shape.texture], 'repeat') || '#ccc';
        context.fill();
        context.strokeStyle = '#000';
        context.stroke();
    }

    return {
        shape,
    };
}

const randomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

const randomPlusMinus = (max: number) => {
    return randomInt(2 * max + 1) - max;
}

const randomBetween = (from: number, to: number) => {
    return from + Math.random() * (to - from);
}

const lineLength = (from: Point, to: Point): number => Math.sqrt((from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]));

const normalize = (vector: Point): Point => {
    const len = lineLength([0, 0], vector);
    return [vector[0] / len, vector[1] / len];
}

const lineNormal = (from: Point, to: Point): Point => normalize([from[1] - to[1], to[0] - from[0]]);

const stretch = (vector: Point, length: number): Point => [vector[0] * length, vector[1] * length];

const add = (origin: Point, vector: Point): Point => [origin[0] + vector[0], origin[1] + vector[1]];

const relative = (origin: Point, to: Point): Point => [to[0] - origin[0], to[1] - origin[1]];

const invert = (vector: Point): Point => [-vector[0], -vector[0]];

const splitLine = (from: Point, to: Point): Point => {
    const splitRatio = randomBetween(0.2, 0.8);
    const length = lineLength(from, to);
    const normal = lineNormal(from, to);
    const lineVector = relative(from, to);
    const splitPoint = add(from, add(stretch(lineVector, splitRatio), stretch(normal, randomPlusMinus(length / 10))));

    return splitPoint;
}

const generateRoad = (from: Point, to: Point, width: number, texture: string): Shape => {
    const SPLITS = 400;
    const widthAdjustment = stretch(lineNormal(from, to), width);


    const centerline: Array<Point> = [from, to];

    for (let i = 0; i < SPLITS; i++) {
        const idx = randomInt(centerline.length - 1) + 1;
        const split = splitLine(centerline[idx - 1], centerline[idx]);
        centerline.splice(idx, 0, split);
    }

    const topLine: Array<LineSegment> = centerline.map(line => ({
        type: 'line',
        to: add(line, invert(widthAdjustment))
    }));
    const bottomLine: Array<LineSegment> = centerline.reverse().map(line => ({
        type: 'line',
        to: add(line, widthAdjustment)
    }));
    return {
        origin: add(from, invert(widthAdjustment)),
        segments: [...topLine, ...bottomLine],
        texture
    };
}


const TEXTURES: Record<string, string> = {
    'gravel-texture': gravel,
    'grass-texture': grass,
};

export const Canvas: React.FC<{}> = () => {

    const [imagesLoaded, imageLoaded] = useReducer((prevstate: number, action: {}) => {
        return prevstate + 1;
    }, 0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (imagesLoaded === Object.keys(TEXTURES).length) {
            const textures = Object.keys(TEXTURES).reduce((acc, tname) => {
                acc[tname] = document.getElementById(tname) as HTMLImageElement;
                return acc;
            }, {} as Record<string, HTMLImageElement>);

            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                if (context) {
                    const drawer = ShapeDrawer(context, textures);

                    const background: Shape = {
                        origin: [0, 0],
                        texture: 'grass-texture',
                        segments: [
                            { type: 'line', to: [800, 0] },
                            { type: 'line', to: [800, 600] },
                            { type: 'line', to: [0, 600] },
                            { type: 'line', to: [0, 0] },
                        ]
                    };
                    const roadHorizontal = generateRoad([-100, 100], [900, 400], 1, 'gravel-texture');
                    const roadVertical = generateRoad([300, -100], [500, 700], 1, 'gravel-texture');

                    drawer.shape(background);
                    drawer.shape(roadHorizontal);
                    drawer.shape(roadVertical);
                }
            }
        }
    }, [imagesLoaded]);

    return <>
        {Object.keys(TEXTURES).map(tname => <img key={tname} src={TEXTURES[tname]} id={tname} style={{ display: 'none' }} alt='' onLoad={imageLoaded} />)}
        <canvas ref={canvasRef} width='800px' height='600px' />
    </>;
}