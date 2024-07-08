// Package imports
import {memo, useCallback} from 'react';
// > Components
import {Button, Tooltip} from '@mui/material';
// Local imports
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';

/** Props necessary to render the 'Generic Button' */
export interface GenericButtonProps {
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

export default memo(GenericButton);

export function GenericButton({
  children,
  disabled,
  icon,
  onClick,
  secondaryColor,
  tooltip,
}: PropsWithChildren<GenericButtonProps>) {
  debugComponentUpdate('GenericButton', true);
  const onClickFinal = useCallback(() => {
    if (onClick !== undefined) {
      onClick();
    }
  }, [onClick]);
  const button = (
    <Button
      startIcon={icon}
      variant="contained"
      color={secondaryColor === true ? 'secondary' : 'primary'}
      disabled={disabled ?? false}
      onClick={onClickFinal}
    >
      {children}
    </Button>
  );
  return disabled !== true && tooltip !== undefined ? (
    <Tooltip title={tooltip}>{button}</Tooltip>
  ) : (
    button
  );
}
