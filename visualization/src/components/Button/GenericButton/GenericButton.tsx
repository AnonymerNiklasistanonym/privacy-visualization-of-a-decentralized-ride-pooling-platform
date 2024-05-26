// Package imports
// > Components
import MuiButton from '@mui/material/Button';
// Type imports
import type {PropsWithChildren} from 'react';

/** Props necessary to render the 'Generic Button' */
export interface ButtonProps {
  /** Function that should be run when button is clicked */
  onClick?: () => void;
}

export default function Button({
  children,
  onClick,
}: PropsWithChildren<ButtonProps>) {
  return (
    <MuiButton variant="contained" onClick={onClick ?? (() => {})}>
      {children}
    </MuiButton>
  );
}
