'use client';

import {signal} from '@preact/signals-react';
// Local imports
import Button from '@components/Button';
// Type imports
import type {FC} from 'react';

export interface ButtonsProps {
  test: string;
}

const Buttons: FC<ButtonsProps> = ({test}) => {
  const spectatorSignal = signal('everything');

  const switchSpectator = (newSpectator: string) => {
    spectatorSignal.value = newSpectator;
    console.debug(test);
    console.debug(spectatorSignal.value);
  };
  return (
    <>
      <p>
        <Button
          onClick={() => {
            switchSpectator('everything');
          }}
        >
          Everything
        </Button>
        <Button
          onClick={() => {
            switchSpectator('public');
          }}
        >
          Public
        </Button>
        <Button
          onClick={() => {
            switchSpectator('auth');
          }}
        >
          AuthService
        </Button>
        <Button
          onClick={() => {
            switchSpectator('match');
          }}
        >
          MatchService
        </Button>
        <Button
          onClick={() => {
            console.error('Not yet implemented');
          }}
        >
          TODO: Specific Actor
        </Button>
      </p>
    </>
  );
};

export default Buttons;
