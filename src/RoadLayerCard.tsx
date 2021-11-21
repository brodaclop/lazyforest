import React, { useState } from 'react';
import { ListComponent } from './ListComponent';
import { Card, CardHeader, CardContent, CardActions, Button, Box } from '@mui/material';
import { Texture } from './Textures';
import { TextureSelector } from './TextureSelector';
import { NumberInput } from './NumberInput';

export interface RoadLayerCardProps {
    name: string;
    textures: Record<string, Texture>;
    sceneHasRiver: boolean;
    generateRoads: (
        mainWidth: number,
        sideRoads: Array<number>,
        texture: string,
        bridgeTexture: string,
        vergeTexture: string,
        vergePercentage: number,
        vergeOverhang: number
    ) => unknown;
}


export const RoadLayerCard: React.FC<RoadLayerCardProps> = ({ name, textures, generateRoads, sceneHasRiver }) => {
    const [mainWidth, setMainWidth] = useState<number>(0);
    const [texture, setTexture] = useState<string>('');
    const [bridgeTexture, setBridgeTexture] = useState<string>('');
    const [sideRoads, setSideRoads] = useState<Array<number>>([]);
    const [vergeTexture, setVergeTexture] = useState<string>('');
    const [vergePercentage, setVergePercentage] = useState<number>(0);
    const [vergeOverhang, setVergeOverhang] = useState<number>(0);

    return <Card sx={{ boxShadow: 3 }}>
        <CardHeader title='Roads' />
        <CardContent>
            <Box>
                <NumberInput width={30} label='Main road width' value={mainWidth} min={0} max={10} step={0.1} onChange={setMainWidth} />
                <TextureSelector width={30} value={texture} label='Road texture' textures={textures ?? {}} category='road' type='pattern' onChange={setTexture} />
                {sceneHasRiver && <TextureSelector width={30} value={bridgeTexture} label='Bridge texture' textures={textures ?? {}} category='bridge' type='pattern' onChange={setBridgeTexture} />}
            </Box>
            <ListComponent
                items={sideRoads.length}
                name='side road'
                addItem={() => {
                    setSideRoads([...sideRoads, 0]);
                }}
                removeItem={index => {
                    sideRoads.splice(index, 1);
                    setSideRoads([...sideRoads]);
                }}
                itemFactory={index =>
                    <NumberInput label='Side road width:' value={sideRoads[index]} min={0} max={10} step={0.1} onChange={value => { sideRoads[index] = value; setSideRoads([...sideRoads]); }} />} />
            <Box>
                <NumberInput width={25} label='Verge width %' value={vergePercentage} min={0} max={100} step={1} onChange={setVergePercentage} />
                <NumberInput width={25} label='Verge overhang %' value={vergeOverhang} min={0} max={100} step={1} onChange={setVergeOverhang} />
                <TextureSelector width={30} value={vergeTexture} textures={textures ?? {}} type='pattern' category='river-edge' onChange={setVergeTexture} label='Verge texture' />
            </Box>
        </CardContent>
        <CardActions>
            <Button variant='contained' disabled={texture === ''} onClick={() => generateRoads(mainWidth, sideRoads, texture, bridgeTexture, vergeTexture, vergePercentage, vergeOverhang)}>Regenerate</Button>
        </CardActions>
    </Card>
}