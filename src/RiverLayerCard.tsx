import { Button } from '@mui/material';
import React, { useState } from 'react';
import { DefinitionCard } from './DefinitionCard';
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

    return <DefinitionCard
        title='River'
        enabled
        titleContent={
            <Button
                disabled={texture === ''}
                onClick={e => { generateRiver(mainWidth, texture, bankTexture, bankPercentage, bankOverhang); e.stopPropagation() }}>
                Regenerate
            </Button>
        }
        blocks={[
            {
                content: <>
                    <NumberInput width={40} label='Width' value={mainWidth} min={0} max={10} step={0.1} onChange={setMainWidth} />
                    <TextureSelector width={40} value={texture} textures={textures ?? {}} type='pattern' category='river' onChange={setTexture} label='River texture' />
                </>
            },
            {
                title: 'Riverbank',
                content: <>
                    <NumberInput width={25} label='Width %' value={bankPercentage} min={0} max={100} step={1} onChange={setBankPercentage} />
                    <NumberInput width={25} label='Overhang %' value={bankOverhang} min={0} max={100} step={1} onChange={setBankOverhang} />
                    <TextureSelector width={30} value={bankTexture} textures={textures ?? {}} type='pattern' category='river-edge' onChange={setBankTexture} label='Texture' />
                </>
            },
        ]}
    />
}