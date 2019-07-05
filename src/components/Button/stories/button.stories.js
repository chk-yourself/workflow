import { storiesOf } from '@storybook/react';
import React from 'react';
import Button from '../Button';
import IconButton from '../IconButton';

const text = 'BaseButton';
const PRIMARY = 'Primary';
const SECONDARY = 'Secondary';
const NEUTRAL = 'Neutral';

storiesOf('Components|Buttons/Base', module)
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
  .add('sizes', () => (
    <>
      <Button size="sm" variant="outlined" color="neutral">
        SMALL
      </Button>
      <Button size="md" variant="outlined" color="neutral">
        MEDIUM
      </Button>
      <Button size="lg" variant="outlined" color="neutral">
        LARGE
      </Button>
    </>
  ));

storiesOf('Components|Buttons/Variants', module)
  .addDecorator(storyFn => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        maxWidth: 400
      }}
    >
      {storyFn()}
    </div>
  ))
  .add('contained', () => (
    <>
      <Button size="sm" color="primary" variant="contained">
        {PRIMARY}
      </Button>
      <Button size="md" color="secondary" variant="contained">
        {SECONDARY}
      </Button>
      <Button size="lg" color="neutral" variant="contained">
        {NEUTRAL}
      </Button>
    </>
  ))
  .add('outlined', () => (
    <>
      <Button size="sm" color="primary" variant="outlined">
        {PRIMARY}
      </Button>
      <Button size="md" color="secondary" variant="outlined">
        {SECONDARY}
      </Button>
      <Button size="lg" color="neutral" variant="outlined">
        {NEUTRAL}
      </Button>
    </>
  ))
  .add('text', () => (
    <>
      <Button size="sm" color="primary" variant="text">
        {PRIMARY}
      </Button>
      <Button size="md" color="secondary" variant="text">
        {SECONDARY}
      </Button>
      <Button size="lg" color="neutral" variant="text">
        {NEUTRAL}
      </Button>
    </>
  ));
