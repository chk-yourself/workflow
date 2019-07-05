import { storiesOf } from '@storybook/react';
import React from 'react';
import Modal from '../Modal';

storiesOf('Components|Modals', module)
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
  .add('sm', () => (
    <>
      <Modal size="sm">Small</Modal>
    </>
  ))
  .add('md', () => (
    <>
      <Modal size="md">Medium</Modal>
    </>
  ))
  .add('lg', () => (
    <>
      <Modal size="lg">Large</Modal>
    </>
  ));
