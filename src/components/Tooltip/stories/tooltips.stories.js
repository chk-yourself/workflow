import { storiesOf } from '@storybook/react';
import React from 'react';
import Tooltip from '../Tooltip';
import TooltipView from '../TooltipView';
import { Button, IconButton } from '../../Button';
import * as Position from '../../../constants/positions';

storiesOf('Data Display|Tooltips', module)
  .add('with Icon Button', () => (
    <Tooltip content="Testing tooltip">
      <IconButton color="neutral" size="sm" icon="info" label="Info" />
    </Tooltip>
  ))
  .add('View', () => <TooltipView>Testing tooltip</TooltipView>);

storiesOf('Data Display|Tooltips/Positions', module)
  .addDecorator(storyFn => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        maxWidth: 400,
        flexWrap: 'wrap'
      }}
    >
      {storyFn()}
    </div>
  ))
  .add('positions', () => (
    <>
      <Tooltip position={Position.TOP} content="Top">
        <Button color="neutral" size="sm" label="Top" />
      </Tooltip>
      <Tooltip position={Position.BOTTOM} content="Bottom">
        <Button color="neutral" size="sm" label="Bottom" />
      </Tooltip>
      <Tooltip position={Position.LEFT} content="Left">
        <Button color="neutral" size="sm" label="Left" />
      </Tooltip>
      <Tooltip position={Position.RIGHT} content="Right">
        <Button color="neutral" size="sm" label="Right" />
      </Tooltip>
      <Tooltip position={Position.TOP_LEFT} content="Top Left">
        <Button color="neutral" size="sm" label="Top Left" />
      </Tooltip>
      <Tooltip position={Position.TOP_RIGHT} content="Top Right">
        <Button color="neutral" size="sm" label="Top Right" />
      </Tooltip>
      <Tooltip position={Position.BOTTOM_LEFT} content="Bottom Left">
        <Button color="neutral" size="sm" label="Bottom Left" />
      </Tooltip>
      <Tooltip position={Position.BOTTOM_RIGHT} content="Bottom Right">
        <Button color="neutral" size="sm" label="Bottom Right" />
      </Tooltip>
    </>
  ));
