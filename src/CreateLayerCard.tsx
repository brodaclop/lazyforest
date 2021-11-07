import React, { useState } from 'react';
import { Button, Card, Header, Input } from 'semantic-ui-react';

export interface CreateLayerCardProps {
    layers: Array<string>;
    onCreate: (name: string) => unknown;
}


export const CreateLayerCard: React.FC<CreateLayerCardProps> = ({ layers, onCreate }) => {
    const [name, setName] = useState<string>('');

    return <Card>
        <Card.Header><Header textAlign='center'>Add new layer</Header></Card.Header>
        <Card.Content>
            <Input label='Layer name' value={name} onChange={e => setName(e.target.value)} />
            <Button
                icon='clone outline'
                content='Create'
                disabled={name === '' || layers.includes(name)}
                onClick={() => {
                    onCreate(name);
                    setName('');
                }} />
        </Card.Content>
    </Card>
}