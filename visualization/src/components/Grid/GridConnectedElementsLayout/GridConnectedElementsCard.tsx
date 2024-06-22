'use client';

// Package imports
import {memo, useState} from 'react';
// > Components
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Clear as DismissIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';

export interface GridConnectedElementsCardProps {
  title: string;
  icon?: ReactElement;
  onDismiss?: () => void;
  onExtend?: (extend: boolean) => void;
}

export default memo(GridConnectedElementsCard);

export function GridConnectedElementsCard({
  icon,
  title,
  children,
  onDismiss,
  onExtend,
}: PropsWithChildren<GridConnectedElementsCardProps>) {
  const [stateShow, setStateShow] = useState<boolean>(true);
  const [stateExtend, setStateExtend] = useState<boolean>(true);
  const actions: Array<ReactElement> = [];
  if (onDismiss !== undefined) {
    actions.push(
      <IconButton
        aria-label="dismiss"
        onClick={() => {
          setStateShow(false);
          onDismiss();
        }}
      >
        <DismissIcon />
      </IconButton>
    );
  }
  if (onExtend !== undefined) {
    actions.push(
      <IconButton
        aria-label="expand"
        onClick={() => {
          setStateExtend(prev => !prev);
          onExtend(stateExtend);
        }}
      >
        <ExpandLessIcon />
      </IconButton>
    );
  }
  return stateShow ? (
    <Card>
      <CardHeader
        avatar={icon ?? <InfoIcon />}
        action={actions}
        title={title.toUpperCase()}
      />
      <Collapse in={stateExtend} timeout="auto" unmountOnExit>
        <CardContent>{children}</CardContent>
      </Collapse>
    </Card>
  ) : undefined;
}
