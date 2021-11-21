import { Select, MenuItem } from '@mui/material';
import React from 'react';
import { DefinitionCard } from './DefinitionCard';
import { NumberInput } from './NumberInput';
import { TINTS } from './Textures';
import { fromPolar, lineLength, Point } from './Vector';

export interface VisualsCardProps {
    shadowVector: Point;
    onShadowChange: (shadowVector: Point) => unknown;
    tint: string;
    onTintChange: (tint: string) => unknown;
    resolution: number;
    onResolutionChange: (resolution: number) => unknown;
    edgeShade: number;
    onEdgeShadeChange: (edgeShade: number) => unknown;
}


export const VisualsCard: React.FC<VisualsCardProps> = ({ tint, shadowVector, onShadowChange, onTintChange, resolution, onResolutionChange, edgeShade, onEdgeShadeChange }) => {
    const shadowLength = Math.round(lineLength(shadowVector) * 10);
    const shadowAngle = Math.round(Math.atan2(shadowVector[1], shadowVector[0]) * 180 / Math.PI);

    return <DefinitionCard
        title='Visual tweaks'
        enabled
        blocks={[
            {
                content: <>
                    <NumberInput width={25} label='Edge shade' min={0} max={300} step={5} value={edgeShade} onChange={onEdgeShadeChange} />
                    <Select sx={{ width: '25%' }} value={tint || 'none'} onChange={e => onTintChange(e.target.value as string)}>
                        <MenuItem value='none'>no tint</MenuItem>
                        {Object.keys(TINTS).map(t => <MenuItem value={TINTS[t]}>{t}</MenuItem>)}
                    </Select>
                    <NumberInput label='Pixels per grid' width={35} min={20} max={100} step={5} value={resolution} onChange={onResolutionChange} />
                </>
            },
            {
                title: 'Shadows',
                content: <>
                    <NumberInput width={40} label='Shadow length' value={shadowLength} min={0} max={50} step={1} onChange={value => onShadowChange(fromPolar(value / 10, Number(shadowAngle) * Math.PI / 180))} />
                    <NumberInput width={40} label='Shadow direction' step={5} min={-180} max={180} value={shadowAngle} onChange={value => onShadowChange(fromPolar(shadowLength / 10, value * Math.PI / 180))} />
                </>
            }
        ]}
    />
}