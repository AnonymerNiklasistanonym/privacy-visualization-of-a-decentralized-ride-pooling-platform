// Package imports
import {memo, useCallback} from 'react';
// > Components
import {Button, Tooltip} from '@mui/material';
// Local imports
// > Misc
import {debugComponentRender, debugMemoHelper} from '@misc/debug';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';

/** Props necessary to render the 'Generic Button' */
export interface InputButtonGenericProps {
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

export default memo(InputButtonGeneric, (prev, next) =>
  debugMemoHelper('InputButtonGeneric', undefined, prev, next)
);

export function InputButtonGeneric({
  children,
  disabled,
  icon,
  onClick,
  secondaryColor,
  tooltip,
}: PropsWithChildren<InputButtonGenericProps>) {
  debugComponentRender('InputButtonGeneric');
  const onClickFinal = useCallback(() => {
    if (onClick !== undefined) {
      onClick();
    }
  }, [onClick]);
  return (
    <Tooltip title={disabled === true ? undefined : tooltip}>
      <span>
        <Button
          startIcon={icon}
          variant="contained"
          color={secondaryColor === true ? 'secondary' : 'primary'}
          disabled={disabled ?? false}
          onClick={onClickFinal}
        >
          {children}
        </Button>
      </span>
    </Tooltip>
  );
}
