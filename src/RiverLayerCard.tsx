import React, { useState } from 'react';
import { Button, Card, Header, Input } from 'semantic-ui-react';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';

export interface RiverLayerCardProps {
    name: string;
    textures: Record<string, Texture>;
    generateRiver: (mainWidth: number, texture: string) => unknown;
}


export const RiverLayerCard: React.FC<RiverLayerCardProps> = ({ name, textures, generateRiver }) => {
    const [mainWidth, setMainWidth] = useState<number>(0);
    const [texture, setTexture] = useState<string>('');

    return <Card>
        <Card.Header><Header textAlign='center'>River Layer</Header></Card.Header>
        <Card.Content>
            <Input label='River width:' type='number' value={mainWidth} onChange={e => setMainWidth(Number(e.target.value))} />
            <TextureSelector value={texture} textures={textures ?? {}} category='river' type='pattern' onChange={setTexture} />
            <Button icon='redo' content='Generate' disabled={texture === ''} onClick={() => generateRiver(mainWidth, texture)} />
        </Card.Content>
    </Card>
}