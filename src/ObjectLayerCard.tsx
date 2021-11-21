import { Add, ClearAll, Delete } from '@mui/icons-material';
import { Card, CardHeader, CardContent, CardActions, Button } from '@mui/material';
import React, { useState } from 'react';
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

    return <Card>
        <CardHeader title={`Object layer ${name}`} />
        <CardContent>
            <NumberInput width={40} label='No. of objects:' value={count} step={1} min={0} max={100} onChange={setCount} />
            <TextureSelector width={40} label='Object texture' value={texture} textures={textures ?? {}} type='single' onChange={setTexture} />
        </CardContent>
        <CardActions>
            <Button variant='contained' startIcon={<Add />} disabled={count === 0 || texture === ''} onClick={() => generateObjects(count, texture)} >Add</Button>
            <Button variant='contained' startIcon={<ClearAll />} disabled={count === 0 || texture === ''} onClick={clearLayer} >Clear</Button>
            <Button variant='contained' startIcon={<Delete />} disabled={count === 0 || texture === ''} onClick={deleteLayer} >Remove</Button>
        </CardActions>
    </Card>
}