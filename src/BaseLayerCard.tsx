import { Button } from '@mui/material';
import React, { useState } from 'react';
import { DefinitionCard } from './DefinitionCard';
import { NumberInput } from './NumberInput';
import { Scene } from './Scene';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';
import { Point } from './Vector';

interface BaseLayerCardProps {
    textures: Record<string, Texture>;
    createScene: (dimensions: Point, baseTexture: string) => unknown;
    load: (scene: Scene) => unknown;
    save: () => unknown;
    render: () => unknown;
}

export const BaseLayerCard: React.FC<BaseLayerCardProps> = ({ textures, createScene, load, save, render }) => {

    const [texture, setTexture] = useState<string>('');
    const [width, setWidth] = useState<number>(10);
    const [height, setHeight] = useState<number>(10);

    return <DefinitionCard
        title={`Scene (${width} x ${height})`}
        titleContent={<><Button
            disabled={texture === ''}
            onClick={e => { createScene([width, height], texture); e.stopPropagation(); }}>
            Create
        </Button>
            <input
                accept="application/json"
                style={{ display: 'none' }}
                id="load-button"
                type="file"
                onChange={async e => {
                    load(JSON.parse(await e.target.files![0].text()));
                }}
            />
            <label htmlFor="load-button">
                <Button component="span">
                    Load
                </Button>
            </label>
            <Button onClick={save}>Save</Button>
            <Button onClick={render}>Export JPG</Button>
        </>
        }
        enabled
        blocks={[{
            title: 'Background',
            content: <>
                <NumberInput width={25} value={width} min={1} max={50} step={1} onChange={setWidth} label='Width' />
                <NumberInput width={25} value={height} min={1} max={50} step={1} onChange={setHeight} label='Height' />
                <TextureSelector width={30} value={texture} textures={textures ?? {}} type='pattern' category='ground' onChange={setTexture} label='Ground texture' />
            </>
        },
        ]} />;

}