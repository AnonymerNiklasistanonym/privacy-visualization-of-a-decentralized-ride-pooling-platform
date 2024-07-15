// Package imports
// > Components
import {IconButton, Tooltip} from '@mui/material';
// Local imports
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {ReactNode} from 'react';

export interface InputExtraActionsAction {
  icon: ReactNode;
  disabled?: boolean;
  text: string;
  callback: () => void;
}

export interface InputExtraActionsProps {
  /** List of actions */
  actions?: Array<InputExtraActionsAction>;
}

export default function InputExtraActions({actions}: InputExtraActionsProps) {
  debugComponentRender('InputExtraActions');
  return (
    <>
      {actions !== undefined
        ? actions.map(a => (
            <Tooltip
              key={`search-bar-action-${a.text}`}
              title={a.disabled === true ? undefined : a.text}
            >
              <span>
                <IconButton
                  type="button"
                  sx={{p: '10px'}}
                  aria-label={a.text}
                  onClick={a.callback}
                  disabled={a.disabled}
                >
                  {a.icon}
                </IconButton>
              </span>
            </Tooltip>
          ))
        : undefined}
    </>
  );
}
