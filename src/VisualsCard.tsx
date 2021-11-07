import React, { useState } from 'react';
import { Card, Header, Input, Select } from 'semantic-ui-react';
import { TINTS } from './Textures';
import { fromPolar, lineLength, Point } from './Vector';

export interface VisualsCardProps {
    shadowVector: Point;
    onShadowChange: (shadowVector: Point) => unknown;
    tint: string;
    onTintChange: (tint: string) => unknown;
}


export const VisualsCard: React.FC<VisualsCardProps> = ({ tint, shadowVector, onShadowChange, onTintChange }) => {
    const shadowLength = Math.round(lineLength(shadowVector) * 10);
    const shadowAngle = Math.round(Math.atan2(shadowVector[1], shadowVector[0]) * 180 / Math.PI);
    console.log(`tint: '${tint}'`);
    return <Card>
        <Card.Header><Header textAlign='center'>Visual tweaks</Header></Card.Header>
        <Card.Content>
            <Select value={tint || 'none'} onChange={(_, { value }) => onTintChange(value as string)} options={
                [{ key: '', value: 'none', text: 'no tint' }, ...Object.keys(TINTS).map(t => ({ key: t, value: TINTS[t], text: t }))]
            } />
            <br />
            <Input label='Shadow length' type='number' value={shadowLength} onChange={e => onShadowChange(fromPolar(Number(e.target.value) / 10, Number(shadowAngle) * Math.PI / 180))} />
            <Input label='Shadow direction' type='number' step={5} value={shadowAngle} onChange={e => onShadowChange(fromPolar(shadowLength / 10, Number(e.target.value) * Math.PI / 180))} />
        </Card.Content>
    </Card>
}