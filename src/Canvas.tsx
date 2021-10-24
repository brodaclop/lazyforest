import React, { useEffect, useReducer, useRef } from 'react';
import gravel from './gravel.jpg';
import grass from './grass.jpg';
import tree from './tree.png';
import { ShapeDrawer } from './ShapeDrawer';
import { generateIntersection, generateRoad, Shape } from './ShapeGenerator';


const TEXTURES: Record<string, string> = {
    'gravel-texture': gravel,
    'grass-texture': grass,
    'tree': tree,
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
                        appearance: {
                            type: 'tiled',
                            texture: 'grass-texture',
                            scale: 0.2,
                        },
                        segments: [
                            { type: 'line', to: [800, 0] },
                            { type: 'line', to: [800, 600] },
                            { type: 'line', to: [0, 600] },
                            { type: 'line', to: [0, 0] },
                        ]
                    };

                    const roads = generateIntersection([
                        {
                            from: [0, 0],
                            width: 30
                        },
                        {
                            from: [300, 700],
                            width: 20
                        },
                        {
                            from: [900, 300],
                            width: 30
                        },
                    ], {
                        texture: 'gravel-texture',
                        scale: 0.3,
                    });

                    drawer.shape(background);
                    roads.forEach(drawer.shape);
                    drawer.shape({
                        origin: [500, 100],
                        segments: [],
                        appearance: {
                            scale: 0.5,
                            type: 'single',
                            texture: 'tree'
                        }
                    });
                    drawer.shape({
                        origin: [300, 100],
                        segments: [],
                        appearance: {
                            scale: 0.5,
                            rotate: 0.5,
                            type: 'single',
                            texture: 'tree'
                        }
                    });
                    drawer.shape({
                        origin: [700, 100],
                        segments: [],
                        appearance: {
                            scale: 0.5,
                            rotate: 1,
                            type: 'single',
                            texture: 'tree'
                        }
                    });
                }
            }
        }
    }, [imagesLoaded]);

    return <>
        {Object.keys(TEXTURES).map(tname => <img key={tname} src={TEXTURES[tname]} id={tname} style={{ display: 'none' }} alt='' onLoad={imageLoaded} />)}
        <canvas ref={canvasRef} width='1200px' height='1000px' />
    </>;
}