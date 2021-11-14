import React, { useState } from 'react';
import { Button, Card, Header, Input } from 'semantic-ui-react';
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

    return <Card>
        <Card.Header><Header textAlign='center'>Scene</Header></Card.Header>
        <Card.Content>
            <Input type='number' label='Width' value={width} step={20} onChange={e => setWidth(Number(e.target.value))} />
            <Input type='number' label='Height' value={height} step={20} onChange={e => setHeight(Number(e.target.value))} />
            <TextureSelector value={texture} textures={textures ?? {}} type='pattern' onChange={setTexture} />

            <Button
                icon='clone outline'
                content='Create'
                disabled={texture === ''}
                onClick={() => createScene([width, height], texture)} />
        </Card.Content>
    </Card>
}