import { Add, ClearAll, Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { DefinitionCard } from './DefinitionCard';
import { NumberInput } from './NumberInput';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';

export interface ObjectLayerCardProps {
    name: string;
    textures: Record<string, Texture>;
    generateObjects: (count: number, texture: string) => unknown;
    clearLayer: () => unknown;
    deleteLayer: () => unknown;
}


export const ObjectLayerCard: React.FC<ObjectLayerCardProps> = ({ name, textures, generateObjects, clearLayer, deleteLayer }) => {
    const [count, setCount] = useState<number>(0);
    const [texture, setTexture] = useState<string>('');

    return <DefinitionCard
        title={`Layer: ${name}`}
        enabled
        titleContent={<>
            <Button startIcon={<Add />} disabled={count === 0 || texture === ''} onClick={e => { generateObjects(count, texture); e.stopPropagation() }} >Add</Button>
            <Button startIcon={<ClearAll />} onClick={e => { clearLayer(); e.stopPropagation(); }} >Clear</Button>
            <Button startIcon={<Delete />} onClick={e => { deleteLayer(); e.stopPropagation(); }} >Remove</Button>
        </>}
        blocks={[
            {
                content: <>
                    <NumberInput width={40} label='No. of objects:' value={count} step={1} min={0} max={100} onChange={setCount} />
                    <TextureSelector width={40} label='Object texture' value={texture} textures={textures ?? {}} type='single' onChange={setTexture} />
                </>
            }
        ]}
    />
}