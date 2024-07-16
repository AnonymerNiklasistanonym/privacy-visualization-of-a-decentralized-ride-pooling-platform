// Package imports
import {useMemo} from 'react';
// > Components
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Info as InfoIcon,
  PushPin as PinIcon,
  Remove as UnpinIcon,
} from '@mui/icons-material';
// Type imports
import type {ReactElement, ReactNode} from 'react';

export interface CardGenericPropsContentElement {
  /** Label of the content element */
  label?: string;
  /** Icon of the content element label */
  labelIcon?: ReactElement;
  /** The actual content or null in case it is not ready yet */
  content: ReactNode | null;
}
export interface CardGenericProps {
  /** A label that should be displayed above all content */
  label?: string;
  /** Restrict card height via a scrollable overflow option */
  scrollHeight?: string;
  /** Restrict card width */
  maxWidth?: string;
  /** Add pin button action */
  pinAction?: (participantId?: string) => void;
  /** Add unpin button action */
  unpinAction?: (participantId?: string) => void;
  /** Add unpin button action */
  isPinned?: boolean;
  /** Fix the content space for the marker scroll */
  fixMarker?: boolean;
}

export interface CardGenericPropsInput extends CardGenericProps {
  /** Icon that describes the element to be rendered */
  icon: ReactElement;
  /** Name that describes the element to be rendered */
  name: string;
  /** Status of the element to be rendered */
  status?: string;
  /** ID of the element to be rendered */
  id?: string;
  /** The content to be rendered */
  content: Array<CardGenericPropsContentElement>;
  /** The actions to be rendered */
  actions?: Array<ReactNode>;
}

export default function CardGeneric({
  actions,
  content,
  fixMarker,
  icon,
  id,
  isPinned,
  label,
  name,
  pinAction,
  status,
  unpinAction,
}: CardGenericPropsInput) {
  const titleStackList = useMemo(() => {
    const result: Array<ReactElement> = [];
    if (label !== undefined) {
      result.push(
        <Chip
          color="warning"
          icon={<InfoIcon />}
          key="label"
          label={label}
          size="small"
          title={label}
        />
      );
    }
    if (id !== undefined) {
      result.push(
        <Chip
          icon={<FingerprintIcon />}
          key="id"
          label={id}
          size="small"
          title={id}
          variant="outlined"
        />
      );
    }
    if (status !== undefined) {
      result.push(
        <Chip
          color="primary"
          icon={<InfoIcon />}
          key="status"
          label={status}
          size="small"
          title={status}
        />
      );
    }
    return result;
  }, [label, id, status]);

  const iconActions = useMemo(() => {
    const result = [];
    if (
      pinAction !== undefined &&
      (isPinned === undefined || isPinned === false)
    ) {
      result.push(
        <IconButton
          key={`generic-card-action-pin-${id}`}
          aria-label="pin"
          onClick={() => pinAction(id)}
        >
          <PinIcon />
        </IconButton>
      );
    }
    if (
      unpinAction !== undefined &&
      (isPinned === undefined || isPinned === true)
    ) {
      result.push(
        <IconButton
          key={`generic-card-action-unpin-${id}`}
          aria-label="unpin"
          onClick={() => unpinAction(id)}
        >
          <UnpinIcon />
        </IconButton>
      );
    }
    return result;
  }, [id, isPinned, pinAction, unpinAction]);

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={icon}
        action={iconActions}
        title={name}
        subheader={
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {titleStackList}
          </Stack>
        }
        sx={{
          // Hide overflow in the header part
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      />
      <CardContent
        sx={{
          // Hide overflow in the content part
          maxHeight: '40vh',
          overflowY: 'scroll',
        }}
      >
        {content.map(({content, label, labelIcon}, index) => (
          <Box key={`content-${label ?? index}`}>
            {label ? (
              <Divider key={`content-${label ?? index}-divider`}>
                <Chip
                  icon={labelIcon ?? undefined}
                  label={label}
                  size="small"
                  sx={{marginBottom: '0.5rem', marginTop: '0.5rem'}}
                />
              </Divider>
            ) : undefined}
            {content ?? (
              <Box
                key={`content-${label ?? index}-content`}
                sx={{display: 'flex', width: '100%'}}
                justifyContent="center"
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        ))}
        {content !== undefined && content.length > 0 && fixMarker === true ? (
          <Box sx={{height: '3rem'}}></Box>
        ) : undefined}
      </CardContent>
      {actions !== undefined && actions.length > 0 ? (
        <CardActions>{actions}</CardActions>
      ) : undefined}
    </Card>
  );
}
