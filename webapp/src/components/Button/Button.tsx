// Type imports
import type {FC} from 'react';
// Test
import MuiButton from '@mui/material/Button';

export interface ButtonProps {
  children: string;
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({children, onClick}) => {
  return (
    <MuiButton variant="contained" onClick={onClick}>
      {children}
    </MuiButton>
  );
};

export default Button;
