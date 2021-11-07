import React, { useState } from 'react';
import { Button, Card, Header, Input } from 'semantic-ui-react';
import { ListComponent } from './ListComponent';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';

export interface RoadLayerCardProps {
    name: string;
    textures: Record<string, Texture>;
    generateRoads: (mainWidth: number, sideRoads: Array<number>, texture: string) => unknown;
}


export const RoadLayerCard: React.FC<RoadLayerCardProps> = ({ name, textures, generateRoads }) => {
    const [mainWidth, setMainWidth] = useState<number>(0);
    const [texture, setTexture] = useState<string>('');
    const [sideRoads, setSideRoads] = useState<Array<number>>([]);

    return <Card>
        <Card.Header><Header textAlign='center'>Road Layer</Header></Card.Header>
        <Card.Content>
            <Input label='Main road width:' type='number' value={mainWidth} onChange={e => setMainWidth(Number(e.target.value))} />
            <TextureSelector value={texture} textures={textures ?? {}} type='pattern' onChange={setTexture} />
            <ListComponent
                items={sideRoads.length}
                name='side road'
                itemIcon='road'
                addItem={() => {
                    setSideRoads([...sideRoads, 0]);
                }}
                removeItem={index => {
                    sideRoads.splice(index, 1);
                    setSideRoads([...sideRoads]);
                }}
                itemFactory={index => <Input label='Side road width:' type='number' value={sideRoads[index]} onChange={e => { sideRoads[index] = Number(e.target.value); setSideRoads([...sideRoads]); }} />} />
            <Button icon='redo' content='Generate' disabled={texture === ''} onClick={() => generateRoads(mainWidth, sideRoads, texture)} />
        </Card.Content>
    </Card>
}