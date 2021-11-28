import { Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { DefinitionCard } from './DefinitionCard';
import { NumberInput } from './NumberInput';
import { Scene } from './Scene';
import { TINTS } from './Textures';
import { fromPolar, lineLength } from './Vector';

export interface VisualsCardProps {
    scene: Scene;
    onSceneChanged: (scene: Scene) => unknown;
    resolution: number;
    onResolutionChange: (resolution: number) => unknown;
}


export const VisualsCard: React.FC<VisualsCardProps> = ({ scene, onSceneChanged, resolution, onResolutionChange }) => {
    const shadowLength = Math.round(lineLength(scene.shadowVector) * 10);
    const shadowAngle = Math.round(Math.atan2(scene.shadowVector[1], scene.shadowVector[0]) * 180 / Math.PI);

    return <DefinitionCard
        title='Visual tweaks'
        enabled
        blocks={[
            {
                content: <>
                    <NumberInput width={25} label='Edge shade' min={0} max={300} step={5} value={scene.edgeShade ?? 0} onChange={value => {
                        scene.edgeShade = value;
                        onSceneChanged(scene);
                    }} />
                    <Select sx={{ width: '25%' }} value={scene.tint || 'none'} onChange={e => {
                        scene.tint = e.target.value as string;
                        onSceneChanged(scene);
                    }}>
                        <MenuItem value='none'>no tint</MenuItem>
                        {Object.keys(TINTS).map(t => <MenuItem value={TINTS[t]}>{t}</MenuItem>)}
                    </Select>
                    <FormControlLabel sx={{ width: `$35%` }} labelPlacement='top' control={<Switch checked={scene.grid} onChange={() => {
                        scene.grid = !scene.grid;
                        onSceneChanged(scene);
                    }} />} label="Display grid" />
                    <NumberInput label='Pixels per grid' width={35} min={20} max={100} step={5} value={resolution} onChange={onResolutionChange} />
                </>
            },
            {
                title: 'Shadows',
                content: <>
                    <NumberInput width={40} label='Shadow length' value={shadowLength} min={0} max={50} step={1} onChange={value => {
                        scene.shadowVector = fromPolar(value / 10, Number(shadowAngle) * Math.PI / 180);
                        onSceneChanged(scene);
                    }} />
                    <NumberInput width={40} label='Shadow direction' step={5} min={-180} max={180} value={shadowAngle} onChange={value => {
                        scene.shadowVector = fromPolar(shadowLength / 10, value * Math.PI / 180);
                        onSceneChanged(scene);
                    }} />
                </>
            }
        ]}
    />
}