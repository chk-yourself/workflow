import { storiesOf } from '@storybook/react';
import React from 'react';
import Tooltip from '../Tooltip';
import TooltipView from '../TooltipView';
import { Button } from '../../Button';
import * as Position from '../../../constants/positions';

storiesOf('Components|Tooltips/Positions', module)
  .addDecorator(storyFn => (
    <div
      style={{
        display: 'grid',
        maxWidth: 960,
        maxHeight: 960,
        gridTemplateColumns: 'auto auto auto',
        alignContent: 'center',
        margin: '0 auto',
        gridGap: 8
      }}
    >
      {storyFn()}
    </div>
  ))
  .add('positions', () => (
    <>
      <div>
        <Tooltip position={Position.TOP_LEFT} content="Top Left">
          <Button variant="contained" color="neutral" size="sm" label="Top Left" />
        </Tooltip>
      </div>
      <div>
        <Tooltip position={Position.TOP} content="Top">
          <Button color="neutral" size="sm" label="Top" />
        </Tooltip>
      </div>
      <div>
        <Tooltip position={Position.TOP_RIGHT} content="Top Right">
          <Button color="neutral" size="sm" label="Top Right" />
        </Tooltip>
      </div>
      <div>
        <Tooltip position={Position.LEFT} content="Left">
          <Button color="neutral" size="sm" label="Left" />
        </Tooltip>
      </div>
      <div />
      <div>
        <Tooltip position={Position.RIGHT} content="Right">
          <Button color="neutral" size="sm" label="Right" />
        </Tooltip>
      </div>
      <div>
        <Tooltip position={Position.BOTTOM_LEFT} content="Bottom Left">
          <Button color="neutral" size="sm" label="Bottom Left" />
        </Tooltip>
      </div>
      <div>
        <Tooltip position={Position.BOTTOM} content="Bottom">
          <Button color="neutral" size="sm" label="Bottom" />
        </Tooltip>
      </div>
      <div>
        <Tooltip position={Position.BOTTOM_RIGHT} content="Bottom Right">
          <Button color="neutral" size="sm" label="Bottom Right" />
        </Tooltip>
      </div>
    </>
  ))
  .add('arrows', () => (
    <>
      <div>
        <TooltipView position={Position.TOP_LEFT} hasArrow>
          Top Left
        </TooltipView>
      </div>
      <div>
        <TooltipView position={Position.TOP} hasArrow>
          Top
        </TooltipView>
      </div>
      <div>
        <TooltipView position={Position.TOP_RIGHT} hasArrow>
          Top Right
        </TooltipView>
      </div>
      <div>
        <TooltipView position={Position.LEFT} hasArrow>
          Left
        </TooltipView>
      </div>
      <div />
      <div>
        <TooltipView position={Position.RIGHT} hasArrow>
          Right
        </TooltipView>
      </div>
      <div>
        <TooltipView position={Position.BOTTOM_LEFT} hasArrow>
          Bottom Left
        </TooltipView>
      </div>
      <div>
        <TooltipView position={Position.BOTTOM} hasArrow>
          Bottom
        </TooltipView>
      </div>
      <div>
        <TooltipView position={Position.BOTTOM_RIGHT} hasArrow>
          Bottom Right
        </TooltipView>
      </div>
    </>
  ));
