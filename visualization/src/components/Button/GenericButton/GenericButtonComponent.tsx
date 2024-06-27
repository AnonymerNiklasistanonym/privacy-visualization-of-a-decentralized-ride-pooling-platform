// Package imports
import {memo} from 'react';
// > Components
import {Button} from '@mui/material';
// Local imports
// > Misc
import {debugComponentUpdate, debugMemoHelper} from '@misc/debug';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';

export interface GenericButtonComponentProps {
  /** Function that should be run when button is clicked */
  onClick?: () => void;
  /** Icon that should be rendered on the button */
  icon?: ReactElement;
  /** Disable button usage */
  disabled?: boolean;
  /** Use secondary color */
  secondaryColor?: boolean;
}

export default memo(GenericButtonComponent, (prev, next) =>
  debugMemoHelper(
    'GenericButtonComponent',
    ['onClick', 'icon', 'disabled', 'secondaryColor'],
    prev,
    next
  )
);

export function GenericButtonComponent({
  children,
  disabled,
  icon,
  onClick,
  secondaryColor,
}: PropsWithChildren<GenericButtonComponentProps>) {
  debugComponentUpdate('GenericButtonComponent', true);
  return (
    <Button
      startIcon={icon}
      variant="contained"
      color={secondaryColor === true ? 'secondary' : 'primary'}
      disabled={disabled ?? false}
      onClick={onClick ?? (() => {})}
    >
      {children}
    </Button>
  );
}
