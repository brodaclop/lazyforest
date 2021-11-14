import { range } from 'lodash';
import React from 'react';
import { Button, List, SemanticICONS } from 'semantic-ui-react';

export interface ListComponentProps {
    items: number;
    itemFactory: (index: number) => JSX.Element;
    addItem: () => unknown;
    removeItem: (index: number) => unknown;
    itemIcon?: SemanticICONS;
    name: string;
}

export const ListComponent: React.FC<ListComponentProps> = ({ items, itemFactory, addItem, removeItem, itemIcon, name }) => {
    return <List divided relaxed>
        {range(0, items).map(index => <List.Item>
            {itemIcon && <List.Icon name={itemIcon} />}
            <List.Content>
                {itemFactory(index)} <Button floated='right' icon='remove' onClick={() => removeItem(index)} />
            </List.Content>
        </List.Item>)}
        <List.Item>
            <List.Content>
                <Button icon='plus' content={`Add ${name}`} onClick={addItem} />
            </List.Content>
        </List.Item>
    </List>;
}