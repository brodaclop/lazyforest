import React, { useCallback, useRef } from 'react';
import { ShapeDrawer } from './ShapeDrawer';
import { generateScene } from './SceneGenerator';
import { fromPolar } from './Vector';
import { Texture, Textures } from './Textures';



export const Canvas: React.FC<{}> = () => {



    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = useCallback((textures: Array<Texture>) => {
        const textureMap: Record<string, Texture> = textures.reduce((acc, curr) => { acc[curr.name] = curr; return acc; }, {} as Record<string, Texture>);

        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                const drawer = ShapeDrawer(context, textures, false);
                const scene = generateScene(15, [
                    {
                        count: 50,
                        texture: textureMap.rock
                    },
                    {
                        count: 50,
                        texture: textureMap.tree
                    },
                    {
                        count: 50,
                        texture: textureMap['other tree']
                    },
                    {
                        count: 50,
                        texture: textureMap.bigtree
                    },
                ], [1200, 1000], fromPolar(1, 10));
                console.log(scene);
                scene.areas.forEach(area => drawer.sceneArea(area));
                scene.objects.forEach(sceneOb => drawer.sceneObject(sceneOb, scene.shadowVector));
            }
        }
    }, [canvasRef]);

    return <>
        <Textures onLoaded={draw} />
        <canvas ref={canvasRef} width='1200px' height='1000px' />
    </>;
}