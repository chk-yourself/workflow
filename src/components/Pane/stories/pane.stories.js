import { storiesOf } from '@storybook/react';
import React from 'react';
import Pane from '../Pane';

storiesOf('Base|Pane', module).add('with styles', () => <Pane width="100px" height="100px" backgroundColor="pink" />);
