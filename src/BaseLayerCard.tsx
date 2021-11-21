import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import React, { useState } from 'react';
import { NumberInput } from './NumberInput';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';
import { Point } from './Vector';

interface BaseLayerCardProps {
    textures: Record<string, Texture>;
    createScene: (dimensions: Point, baseTexture: string) => unknown;
}

export const BaseLayerCard: React.FC<BaseLayerCardProps> = ({ textures, createScene }) => {

    const [texture, setTexture] = useState<string>('');
    const [width, setWidth] = useState<number>(10);
    const [height, setHeight] = useState<number>(10);

    return <Card sx={{ boxShadow: 3 }}>
        <CardHeader title='Scene' />
        <CardContent>
            <NumberInput width={25} value={width} min={1} max={50} step={1} onChange={setWidth} label='Width' />
            <NumberInput width={25} value={height} min={1} max={50} step={1} onChange={setHeight} label='Height' />
            <TextureSelector width={30} value={texture} textures={textures ?? {}} type='pattern' category='ground' onChange={setTexture} label='Ground texture' />
        </CardContent>
        <CardActions>
            <Button
                variant='contained'
                disabled={texture === ''}
                onClick={() => createScene([width, height], texture)}>
                Create
            </Button>
        </CardActions>
    </Card>
}