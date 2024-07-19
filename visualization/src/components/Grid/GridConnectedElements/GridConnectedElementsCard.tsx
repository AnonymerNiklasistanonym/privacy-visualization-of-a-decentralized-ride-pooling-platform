'use client';

// Package imports
import {memo, useMemo, useState} from 'react';
// > Components
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
} from '@mui/material';
import {
  Clear as DismissIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';
import {debugComponentElementUpdate} from '@misc/debug';

export interface GridConnectedElementsCardProps {
  title?: string;
  icon?: ReactElement;
  muiGridItemSize?: number;
  onDismiss?: () => void;
  onExtend?: (extend: boolean) => void;
}

export default memo(GridConnectedElementsCard);

export function GridConnectedElementsCard({
  icon,
  title,
  children,
  muiGridItemSize,
  onDismiss,
  onExtend,
}: PropsWithChildren<GridConnectedElementsCardProps>) {
  const [stateShow, setStateShow] = useState<boolean>(true);
  const [stateExtend, setStateExtend] = useState<boolean>(true);

  const actions = useMemo<Array<ReactElement>>(() => {
    debugComponentElementUpdate(`GridConnectedElementsCard#actions#${title}`);

    const actionsList: Array<ReactElement> = [];
    if (onDismiss !== undefined) {
      actionsList.push(
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
      actionsList.push(
        <IconButton
          aria-label="expand"
          onClick={() => {
            setStateExtend(prev => !prev);
            onExtend(stateExtend);
          }}
        >
          {stateExtend ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      );
    }
    return actionsList;
  }, [onDismiss, onExtend, stateExtend, title]);

  const avatar = useMemo(() => icon ?? <InfoIcon />, [icon]);

  const card = useMemo(
    () => (
      <Card>
        {title !== undefined ? (
          <CardHeader
            avatar={avatar}
            action={actions}
            title={title.toUpperCase()}
          />
        ) : undefined}
        <Collapse in={stateExtend} timeout="auto" unmountOnExit>
          <CardContent>{children}</CardContent>
        </Collapse>
      </Card>
    ),
    [actions, children, avatar, stateExtend, title]
  );

  if (stateShow) {
    if (muiGridItemSize !== undefined) {
      return (
        <Grid item xs={muiGridItemSize}>
          {card}
        </Grid>
      );
    }
    return card;
  }
  return undefined;
}
