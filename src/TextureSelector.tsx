import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React from 'react';
import { Texture, TextureCategory } from './Textures';

export interface TextureSelectorProps {
    textures: Record<string, Texture>,
    type: 'single' | 'pattern',
    category?: TextureCategory,
    label?: string,
    value: string,
    width?: number,
    onChange: (name: string) => unknown,
}


export const TextureSelector: React.FC<TextureSelectorProps> = ({ textures, type, category, label, value, width = 90, onChange }) => {
    const renderValue = (t: string) => <><img alt={`Texture: ${t}`} style={{ height: '1.5rem', marginRight: '0.2rem' }} src={textures[t].url} />{t}</>;

    return <FormControl sx={{ width: `${width}%` }}>
        <InputLabel>{label}</InputLabel>
        <Select
            value={value}
            onChange={(e) => onChange(e.target.value as string)}
            label={label}
            displayEmpty
            renderValue={selected => selected ? renderValue(selected) : label}
            autoWidth
        >
            <MenuItem value=''>None</MenuItem>
            {Object.keys(textures)
                .filter(t => textures[t].type === type)
                .filter(t => !category || (textures[t].category === category))
                .map(t => <MenuItem value={t}>{renderValue(t)}</MenuItem>)}
        </Select>
    </FormControl>;
}