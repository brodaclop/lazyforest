import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Header, Icon, Input } from 'semantic-ui-react';
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
        <Card.Header><Header textAlign='center'>Object layer: {name}</Header></Card.Header>
        <Card.Content>
            <Input type='number' label='No. of objects:' value={count} step={1} onChange={e => setCount(Number(e.target.value))} />
            <TextureSelector value={texture} textures={textures ?? {}} type='single' onChange={setTexture} />
            <ButtonGroup>
                <Button content='Add' icon='plus' disabled={count === 0 || texture === ''} onClick={() => generateObjects(count, texture)} />
                <Button content='Clear' icon='eraser' onClick={clearLayer} />
                <Button content='Remove' icon='remove' onClick={deleteLayer} />
            </ButtonGroup>
        </Card.Content>
    </Card>
}