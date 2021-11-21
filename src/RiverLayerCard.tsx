import { Button, Card, CardActions, CardContent, CardHeader, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { NumberInput } from './NumberInput';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';

export interface RiverLayerCardProps {
    name: string;
    textures: Record<string, Texture>;
    generateRiver: (mainWidth: number, texture: string, bankTexture: string, bankPercentage: number, bankOverhang: number) => unknown;
}


export const RiverLayerCard: React.FC<RiverLayerCardProps> = ({ name, textures, generateRiver }) => {
    const [mainWidth, setMainWidth] = useState<number>(0);
    const [texture, setTexture] = useState<string>('');
    const [bankTexture, setBankTexture] = useState<string>('');
    const [bankPercentage, setBankPercentage] = useState<number>(0);
    const [bankOverhang, setBankOverhang] = useState<number>(0);

    return <Card sx={{ boxShadow: 3 }}>
        <CardHeader title='River' />
        <CardContent>
            <List>
                <ListItem>
                    <NumberInput width={40} label='Width' value={mainWidth} min={0} max={10} step={0.1} onChange={setMainWidth} />
                    <TextureSelector width={40} value={texture} textures={textures ?? {}} type='pattern' category='river' onChange={setTexture} label='River texture' />
                </ListItem>
                <ListItem >
                    <NumberInput width={25} label='Bank width %' value={bankPercentage} min={0} max={100} step={1} onChange={setBankPercentage} />
                    <NumberInput width={25} label='Bank overhang %' value={bankOverhang} min={0} max={100} step={1} onChange={setBankOverhang} />
                    <TextureSelector width={30} value={bankTexture} textures={textures ?? {}} type='pattern' category='river-edge' onChange={setBankTexture} label='Bank texture' />
                </ListItem>
            </List>
        </CardContent>
        <CardActions>
            <Button variant='contained' disabled={texture === ''} onClick={() => generateRiver(mainWidth, texture, bankTexture, bankPercentage, bankOverhang)}>Regenerate</Button>
        </CardActions>
    </Card >
}