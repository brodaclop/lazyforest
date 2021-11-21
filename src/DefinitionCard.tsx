import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

interface DefinitionCardProps {
    title: string;
    titleContent?: JSX.Element;
    enabled?: boolean;
    blocks: Array<{
        title?: string;
        content: JSX.Element;
    }>;

}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ title, enabled, blocks, titleContent }) => <Accordion disabled={!enabled}>
    <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{title} {titleContent}</Typography>

    </AccordionSummary>
    <AccordionDetails>
        {blocks.map(block => <Box sx={{ m: 1 }}>
            {block.title && <Typography>{block.title}</Typography>}
            <Box sx={{ borderTop: block.title ? 1 : 0, pt: block.title ? 1 : 0 }}>
                {block.content}
            </Box>
        </Box>)}
    </AccordionDetails>
</Accordion>;