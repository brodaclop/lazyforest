import React from 'react';
import { Select } from 'semantic-ui-react';
import { Texture, TextureCategory } from './Textures';

export interface TextureSelectorProps {
    textures: Record<string, Texture>,
    type: 'single' | 'pattern',
    category?: TextureCategory,
    value: string,
    onChange: (name: string) => unknown,
}

export const TextureSelector: React.FC<TextureSelectorProps> = ({ textures, type, category, value, onChange }) => {
    return <Select
        value={value}
        onChange={(_, { value }) => onChange(value as string)}
        placeholder='Select texture'
        options={
            Object.keys(textures)
                .filter(t => textures[t].type === type)
                .filter(t => !category || (textures[t].category === category))
                .map(t => ({ key: t, text: t, value: t, image: textures[t].url }))
        }
    />
}