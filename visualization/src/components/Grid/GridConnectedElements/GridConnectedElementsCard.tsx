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
  }, [onDismiss, onExtend, stateExtend]);

  const card = (
    <Card>
      {title !== undefined ? (
        <CardHeader
          avatar={icon ?? <InfoIcon />}
          action={actions}
          title={title.toUpperCase()}
        />
      ) : undefined}
      <Collapse in={stateExtend} timeout="auto" unmountOnExit>
        <CardContent>{children}</CardContent>
      </Collapse>
    </Card>
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
