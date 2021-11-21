import { Add, Delete } from '@mui/icons-material';
import { List, ListItem, Button, IconButton } from '@mui/material';
import { range } from 'lodash';
import React from 'react';

export interface ListComponentProps {
    items: number;
    itemFactory: (index: number) => JSX.Element;
    addItem: () => unknown;
    removeItem: (index: number) => unknown;
    name: string;
}

export const ListComponent: React.FC<ListComponentProps> = ({ items, itemFactory, addItem, removeItem, name }) => {
    return <List>
        {range(0, items).map(index => <ListItem>
            {itemFactory(index)} <IconButton onClick={() => removeItem(index)}><Delete /></IconButton>
        </ListItem>)}
        <ListItem>
            <Button startIcon={<Add />} onClick={addItem}>{`Add ${name}`}</Button>
        </ListItem>
    </List>;
}