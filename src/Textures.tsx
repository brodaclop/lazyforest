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

export interface Texture {
    name: string;
    category: TextureCategory;
    url: string;
    type: 'single' | 'pattern';
    scale: number;
    height: number;
    radius: number;
    loadedImage: HTMLImageElement;
}

export const TINTS: Record<string, string> = {
    sunset: 'rgba(230,120,0,0.15)',
    evening: 'rgba(0,0,250,0.2)',
    night: 'rgba(0,0,250,0.3)',
}

export type TextureCategory = 'ground' | 'river' | 'road' | 'bridge' | 'tree' | 'rock';

export const TEXTURES: Array<Omit<Texture, 'loadedImage'>> = [
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
        name: 'lighter grass',
        url: lighterGrass,
        type: 'pattern',
        scale: 1,
        category: 'ground',
        height: 0,
        radius: 0,
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
]

export const Textures: React.FC<{ onLoaded: (textures: Array<Texture>) => unknown }> = ({ onLoaded }) => {

    const [imagesLoaded, imageLoaded] = useReducer((prevstate: number, action: {}) => {
        return prevstate + 1;
    }, 0);

    useEffect(() => {
        if (imagesLoaded === TEXTURES.length) {
            onLoaded(TEXTURES.map(t => ({ ...t, loadedImage: document.getElementById(t.name) as HTMLImageElement })));
        }
    }, [imagesLoaded, onLoaded]);

    return <>
        {TEXTURES.map(t => <img key={t.name} src={t.url} id={t.name} style={{ display: 'none' }} alt='' onLoad={imageLoaded} />)}
    </>;
}