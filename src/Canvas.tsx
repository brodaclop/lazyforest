import React, { useCallback, useEffect, useRef, useState } from 'react';
import { drawScene } from './ShapeDrawer';
import { SceneGenerator } from './SceneGenerator';
import { Point } from './Vector';
import { Texture, Textures } from './Textures';
import { Scene } from './Scene';
import { ObjectLayerCard } from './ObjectLayerCard';
import { CreateLayerCard } from './CreateLayerCard';
import { RoadLayerCard } from './RoadLayerCard';
import { Card, Checkbox } from 'semantic-ui-react';
import { VisualsCard } from './VisualsCard';
import { BaseLayerCard } from './BaseLayerCard';
import { RiverLayerCard } from './RiverLayerCard';

const SCALE = 70;

export const Canvas: React.FC<{}> = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [textures, setTeztures] = useState<Record<string, Texture>>();
    const [scene, setScene] = useState<Scene>(SceneGenerator.create([10, 10], 'grass'));
    const [resolution, setResolution] = useState<number>(SCALE);
    const [debug, setDebug] = useState<boolean>(false);

    const regenerateRoads = useCallback((layer: string, mainWidth: number, sideRoads: Array<number>, texture: string) => {
        if (textures) {
            setScene({ ...SceneGenerator.roads(scene, layer, mainWidth, sideRoads, textures[texture], scene.layers.river.areas?.[0]) });
        }
    }, [scene, textures]);

    const regenerateRiver = useCallback((layer: string, mainWidth: number, texture: string) => {
        if (textures) {
            setScene({ ...SceneGenerator.river(scene, layer, mainWidth, textures[texture]) });
        }
    }, [scene, textures]);


    const clearLayer = useCallback((layer: string) => {
        delete scene.layers?.[layer]?.areas;
        delete scene.layers?.[layer]?.objects;
        setScene({ ...scene });
    }, [scene]);

    const removeLayer = useCallback((layer: string) => {
        delete scene.layers?.[layer];
        setScene({ ...scene });
    }, [scene]);

    const createLayer = useCallback((layer: string) => {
        scene.layers[layer] = { type: 'object' };
        setScene({ ...scene });
    }, [scene]);

    const generateObjects = useCallback((layer: string, count: number, texture: string) => {
        if (textures) {
            SceneGenerator.objects(scene, layer, count, textures[texture]);
        }
        setScene({ ...scene });
    }, [scene, textures]);

    const createScene = useCallback((dimension: Point, texture: string) => {
        setScene(SceneGenerator.create(dimension, texture));
    }, []);

    useEffect(() => {
        if (textures) {
            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                if (context) {
                    drawScene(context, textures, scene, debug);
                }
            }
        }
    }, [textures, scene, resolution, debug]);

    const onTexturesLoaded = useCallback((textures: Array<Texture>) => {
        const textureMap: Record<string, Texture> = textures.reduce((acc, curr) => { acc[curr.name] = curr; return acc; }, {} as Record<string, Texture>);
        setTeztures(textureMap);
    }, []);

    return <>
        <Textures onLoaded={onTexturesLoaded} />
        <div style={{ display: 'flex' }}>
            <div>
                <Card.Group itemsPerRow={1}>
                    <BaseLayerCard textures={textures ?? {}} createScene={createScene} />
                    <RiverLayerCard name='river' textures={textures ?? {}} generateRiver={regenerateRiver.bind(null, 'river')} />
                    <RoadLayerCard name='road' textures={textures ?? {}} generateRoads={regenerateRoads.bind(null, 'road')} />
                    {Object.keys(scene.layers).filter(layer => scene.layers[layer].type === 'object').map(layer => {
                        return <ObjectLayerCard
                            name={layer}
                            textures={textures ?? {}}
                            generateObjects={(count, texture) => generateObjects(layer, count, texture)}
                            clearLayer={() => clearLayer(layer)}
                            deleteLayer={() => removeLayer(layer)}
                        />
                    })}
                    {scene.layers.road && <CreateLayerCard layers={Object.keys(scene.layers)} onCreate={createLayer} />}

                    <VisualsCard tint={scene.tint ?? ''} shadowVector={scene.shadowVector} onShadowChange={shadow => {
                        scene.shadowVector = shadow;
                        setScene({ ...scene });
                    }}
                        onTintChange={tint => {
                            scene.tint = tint;
                            setScene({ ...scene });
                        }}
                        resolution={resolution}
                        onResolutionChange={setResolution}
                    />
                </Card.Group>

                <Checkbox checked={debug} onChange={(_, data) => setDebug(!debug)} toggle />
            </div>
            <canvas style={{ width: `${scene.size[0] * resolution}px`, height: `${scene.size[1] * resolution}px` }} ref={canvasRef} width={`${scene.size[0] * resolution}px`} height={`${scene.size[1] * resolution}px`} />
        </div>
    </>;
}