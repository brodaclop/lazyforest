import React, { useEffect, useReducer } from 'react';

import gravel from './textures/gravel.jpg';
import grass from './textures/grass.jpg';
import tree from './textures/tree.png';
import tree2 from './textures/tree2.png';
import rock from './textures/rock.png';
import dirt from './textures/dirtroad.jpg';
import lighterGrass from './textures/lightergrass.jpg';
import water from './textures/water.jpg';
import bridge from './textures/bridge.png';
import bridge2 from './textures/bridge2.png';
import soil from './textures/soil.jpg';
import moss from './textures/moss.jpg';
import snow from './textures/snow.jpg';
import coarseSnow from './textures/coarse-snow.jpg';
import ice from './textures/ice.jpg';
import greenWater from './textures/green-water.jpg';
import partialSnow from './textures/partial-snow.jpg';
import snowDirty from './textures/snow-dirty.jpg';
import snowRoad from './textures/snow-road.jpg';
import snowyPine from './textures/snowy-pine.png';
import stump from './textures/stump.png';
import trunk from './textures/trunk.png';
import bumpySnow from './textures/snow-bumpy.jpg';
import rubble from './textures/rubble.png';

export interface Texture {
    name: string;
    category: TextureCategory;
    url: string;
    type: 'single' | 'pattern';
    scale: number;
    height: number;
    radius: number;
    alphaMultiplier?: number;
    loadedImage: HTMLImageElement;
}

export const TINTS: Record<string, string> = {
    sunset: 'rgba(230,120,0,0.15)',
    evening: 'rgba(0,0,250,0.2)',
    night: 'rgba(0,0,250,0.3)',
}

export type TextureCategory = 'ground' | 'river' | 'road' | 'bridge' | 'tree' | 'rock' | 'river-edge' | 'road-edge';

export const TEXTURES: Array<Omit<Texture, 'loadedImage' | 'transparentImage'>> = [
    {
        name: 'water',
        url: water,
        type: 'pattern',
        scale: 1,
        category: 'river',
        height: 0,
        radius: 0,
    },
    {
        name: 'green water',
        url: greenWater,
        type: 'pattern',
        scale: 2,
        category: 'river',
        height: 0,
        radius: 0,
    },
    {
        name: 'ice',
        url: ice,
        type: 'pattern',
        scale: 2,
        category: 'river',
        height: 0,
        radius: 0,
    },
    {
        name: 'bridge',
        url: bridge,
        type: 'pattern',
        scale: 1,
        category: 'bridge',
        height: 0,
        radius: 0,
    },
    {
        name: 'straight bridge',
        url: bridge2,
        type: 'pattern',
        scale: 1,
        category: 'bridge',
        height: 0,
        radius: 0,
    },
    {
        name: 'gravel',
        url: gravel,
        type: 'pattern',
        scale: 1,
        category: 'road',
        height: 0,
        radius: 0,
    },
    {
        name: 'dirt',
        url: dirt,
        type: 'pattern',
        scale: 1,
        category: 'road',
        height: 0,
        radius: 0,
    },
    {
        name: 'grass',
        url: grass,
        type: 'pattern',
        scale: 3,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'snow',
        url: snow,
        type: 'pattern',
        scale: 3,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'drifting snow',
        url: bumpySnow,
        type: 'pattern',
        scale: 3,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'snowy road',
        url: snowRoad,
        type: 'pattern',
        scale: 3,
        category: 'road',
        height: 0,
        radius: 0,
    },
    {
        name: 'dirty snow',
        url: snowDirty,
        type: 'pattern',
        scale: 3,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'partial snow',
        url: partialSnow,
        type: 'pattern',
        scale: 3,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'snow bank',
        url: coarseSnow,
        type: 'pattern',
        scale: 2.3,
        category: 'road-edge',
        height: 0,
        radius: 0,
        alphaMultiplier: 0.5
    },
    {
        name: 'lighter grass',
        url: lighterGrass,
        type: 'pattern',
        scale: 1,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'soil',
        url: soil,
        type: 'pattern',
        scale: 1,
        category: 'river-edge',
        height: 0,
        radius: 0,
        alphaMultiplier: 0.7
    },
    {
        name: 'moss',
        url: moss,
        type: 'pattern',
        scale: 1,
        category: 'road-edge',
        height: 0,
        radius: 0,
        alphaMultiplier: 0.3
    },
    {
        name: 'tree',
        url: tree,
        type: 'single',
        scale: 2,
        category: 'tree',
        height: 8,
        radius: 1,
    },
    {
        name: 'snowy pine',
        url: snowyPine,
        type: 'single',
        scale: 2,
        category: 'tree',
        height: 20,
        radius: 1,
    },
    {
        name: 'bigtree',
        url: tree,
        type: 'single',
        scale: 4,
        category: 'tree',
        height: 16,
        radius: 2,
    },
    {
        name: 'other tree',
        url: tree2,
        type: 'single',
        scale: 3,
        category: 'tree',
        height: 12,
        radius: 1.5,
    },
    {
        name: 'rock',
        url: rock,
        type: 'single',
        scale: 0.3,
        category: 'rock',
        height: 2,
        radius: 0.25,
    },
    {
        name: 'rubble',
        url: rubble,
        type: 'single',
        scale: 0.7,
        category: 'rock',
        height: 2,
        radius: 0.4,
    },
    {
        name: 'tree stump',
        url: stump,
        type: 'single',
        scale: 0.6,
        category: 'tree',
        height: 5,
        radius: 0.4,
    },
    {
        name: 'fallen tree trunk',
        url: trunk,
        type: 'single',
        scale: 1.6,
        category: 'tree',
        height: 4,
        radius: 0.8,
    },
]

declare const OffscreenCanvas: any;

const makeImageTransparent = async (image: HTMLImageElement, alphaMultiplier: number): Promise<HTMLImageElement> => {
    const offscreen = new OffscreenCanvas(image.naturalWidth, image.naturalHeight);
    const osContext = offscreen.getContext('2d') as CanvasRenderingContext2D;
    osContext.drawImage(image, 0, 0);
    const imageData = osContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
    for (let i = 3; i < imageData.data.length; i += 4) {
        imageData.data.set([imageData.data[i] * alphaMultiplier], i);
    }
    osContext.putImageData(imageData, 0, 0);
    const output = new Image();

    const blob = await offscreen.convertToBlob({
        type: "image/png",
    });

    output.src = URL.createObjectURL(blob); // use toDataURL() to avoid cleanup problems
    return output;
}


export const Textures: React.FC<{ onLoaded: (textures: Array<Texture>) => unknown }> = ({ onLoaded }) => {

    const [imagesLoaded, imageLoaded] = useReducer((prevstate: number, action: {}) => {
        return prevstate + 1;
    }, 0);

    useEffect(() => {
        if (imagesLoaded === TEXTURES.length) {
            (async () => {
                const loaded: Array<Texture> = [];
                for (let i = 0; i < TEXTURES.length; i++) {
                    const t = TEXTURES[i];
                    let loadedImage = document.getElementById(t.name) as HTMLImageElement;
                    if (t.alphaMultiplier !== undefined) {
                        loadedImage = await makeImageTransparent(loadedImage, t.alphaMultiplier);
                    }
                    loaded.push({ ...t, loadedImage });
                }
                onLoaded(loaded);

            })();
        }
    }, [imagesLoaded, onLoaded]);

    return <>
        {TEXTURES.map(t => <img key={t.name} src={t.url} id={t.name} style={{ display: 'none' }} alt='' onLoad={imageLoaded} />)}
    </>;
}