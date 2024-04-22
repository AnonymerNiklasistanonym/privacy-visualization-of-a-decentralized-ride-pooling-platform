// Package imports
// > Components
import MuiButton from '@mui/material/Button';
// Type imports
import type {PropsWithChildren} from 'react';

export interface ButtonProps {
  onClick: () => void;
}

export default function Button({
  children,
  onClick,
}: PropsWithChildren<ButtonProps>) {
  return (
    <MuiButton variant="contained" onClick={onClick}>
      {children}
    </MuiButton>
  );
}
