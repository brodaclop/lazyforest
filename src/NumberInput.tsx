import { FormControlLabel, Slider } from '@mui/material';
import React from 'react';

interface NumberInputProps {
    value: number,
    min: number,
    max: number,
    step?: number,
    label: string,
    width?: number,
    onChange: (value: number) => unknown
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, min, max, step, label, width = 90, onChange }) => {
    return <FormControlLabel sx={{ width: `${width}%` }} label={label} labelPlacement='top' control={<Slider value={value} valueLabelDisplay='auto' min={min} max={max} step={step} marks={!!step} onChange={(_, value) => onChange(value as number)} />} />;
}