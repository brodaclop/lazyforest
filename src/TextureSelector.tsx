import React from 'react';
import { Select } from 'semantic-ui-react';
import { Texture } from './Textures';

export const TextureSelector: React.FC<{ textures: Record<string, Texture>, type: 'single' | 'pattern', value: string, onChange: (name: string) => unknown }> = ({ textures, type, value, onChange }) => {
    return <Select
        value={value}
        onChange={(_, { value }) => onChange(value as string)}
        placeholder='Select texture'
        options={
            Object.keys(textures).filter(t => textures[t].type === type).map(t => ({ key: t, text: t, value: t, image: textures[t].url }))
        }
    />
}