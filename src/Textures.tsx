import React, { useEffect, useReducer } from 'react';

import gravel from './gravel.jpg';
import grass from './grass.jpg';
import tree from './tree.png';
import tree2 from './tree2.png';
import rock from './rock.png';

export interface Texture {
    name: string;
    category: string;
    url: string;
    type: 'single' | 'pattern';
    scale: number;
    height: number;
    radius: number;
    loadedImage: HTMLImageElement;
}

export const TEXTURES: Array<Omit<Texture, 'loadedImage'>> = [
    {
        name: 'gravel',
        url: gravel,
        type: 'pattern',
        scale: 0.3,
        category: 'road',
        height: 0,
        radius: 0,
    },
    {
        name: 'grass',
        url: grass,
        type: 'pattern',
        scale: 0.2,
        category: 'ground',
        height: 0,
        radius: 0,
    },
    {
        name: 'tree',
        url: tree,
        type: 'single',
        scale: 0.2,
        category: 'tree',
        height: 8,
        radius: 30,
    },
    {
        name: 'bigtree',
        url: tree,
        type: 'single',
        scale: 0.3,
        category: 'tree',
        height: 16,
        radius: 45,
    },
    {
        name: 'other tree',
        url: tree2,
        type: 'single',
        scale: 0.1,
        category: 'tree',
        height: 12,
        radius: 40,
    },
    {
        name: 'rock',
        url: rock,
        type: 'single',
        scale: 0.05,
        category: 'rock',
        height: 2,
        radius: 10,
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