import { Add } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, TextField } from '@mui/material';
import React, { useState } from 'react';

export interface CreateLayerCardProps {
    layers: Array<string>;
    onCreate: (name: string) => unknown;
}


export const CreateLayerCard: React.FC<CreateLayerCardProps> = ({ layers, onCreate }) => {
    const [name, setName] = useState<string>('');

    return <Card sx={{ boxShadow: 3 }}>
        <CardHeader title='Add object layer' />
        <CardContent>
            <TextField label='Name' value={name} onChange={e => setName(e.target.value)} />
        </CardContent>
        <CardActions>
            <Button
                startIcon={<Add />}
                disabled={name === '' || layers.includes(name)}
                onClick={() => {
                    onCreate(name);
                    setName('');
                }}>
                Create
            </Button>
        </CardActions>
    </Card>
}