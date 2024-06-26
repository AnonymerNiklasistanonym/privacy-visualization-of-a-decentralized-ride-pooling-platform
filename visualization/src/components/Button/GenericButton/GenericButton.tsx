// Package imports
// > Components
import {Button, Tooltip} from '@mui/material';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';

/** Props necessary to render the 'Generic Button' */
export interface ButtonProps {
  /** Function that should be run when button is clicked */
  onClick?: () => void;
  /** Icon that should be rendered on the button */
  icon?: ReactElement;
  /** Disable button usage */
  disabled?: boolean;
  /** Use secondary color */
  secondaryColor?: boolean;
  /** Optional tooltip message */
  tooltip?: string;
}

export default function GenericButton({
  children,
  disabled,
  icon,
  onClick,
  secondaryColor,
  tooltip,
}: PropsWithChildren<ButtonProps>) {
  return (
    <Tooltip title={tooltip}>
      <Button
        startIcon={icon}
        variant="contained"
        color={secondaryColor === true ? 'secondary' : 'primary'}
        disabled={disabled ?? false}
        onClick={onClick ?? (() => {})}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
