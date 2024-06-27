// Package imports
import {memo} from 'react';
// > Components
import {Tooltip} from '@mui/material';
// Local imports
// > Components
import GenericButtonComponent from './GenericButtonComponent';
// > Misc
import {debugComponentUpdate} from '@misc/debug';
// Type imports
import type {GenericButtonComponentProps} from './GenericButtonComponent';
import type {PropsWithChildren} from 'react';

/** Props necessary to render the 'Generic Button' */
export interface GenericButtonProps extends GenericButtonComponentProps {
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
  const button = (
    <GenericButtonComponent
      disabled={disabled}
      icon={icon}
      onClick={onClick}
      secondaryColor={secondaryColor}
    >
      {children}
    </GenericButtonComponent>
  );
  return disabled !== true && tooltip !== undefined ? (
    <Tooltip title={tooltip}>{button}</Tooltip>
  ) : (
    <>{button}</>
  );
}
