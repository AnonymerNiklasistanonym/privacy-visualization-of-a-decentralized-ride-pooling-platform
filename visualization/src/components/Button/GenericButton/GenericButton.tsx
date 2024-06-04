// Package imports
// > Components
import MuiButton from '@mui/material/Button';
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
}

export default function Button({
  children,
  disabled,
  icon,
  onClick,
  secondaryColor,
}: PropsWithChildren<ButtonProps>) {
  return (
    <MuiButton
      startIcon={icon}
      variant="contained"
      color={secondaryColor === true ? 'secondary' : 'primary'}
      disabled={disabled ?? false}
      onClick={onClick ?? (() => {})}
    >
      {children}
    </MuiButton>
  );
}
