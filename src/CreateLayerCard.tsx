import { Add } from '@mui/icons-material';
import { Accordion, AccordionSummary, Button, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

export interface CreateLayerCardProps {
    layers: Array<string>;
    onCreate: (name: string) => unknown;
}


export const CreateLayerCard: React.FC<CreateLayerCardProps> = ({ layers, onCreate }) => {
    const [name, setName] = useState<string>('');

    return <Accordion onClick={e => e.stopPropagation()}>
        <AccordionSummary>
            <Typography>
                <TextField variant='standard' size='small' label='Add object layer' value={name} onChange={e => setName(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <Button
                                startIcon={<Add />}
                                disabled={name === '' || layers.includes(name)}
                                onClick={() => {
                                    onCreate(name);
                                    setName('');
                                }}>
                                Create
                            </Button>
                        </InputAdornment>

                    }}
                />
            </Typography>
        </AccordionSummary>
    </Accordion>;
}