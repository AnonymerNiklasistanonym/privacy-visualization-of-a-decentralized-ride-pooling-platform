// Package imports
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
import {type ReactElement, type ReactNode, useMemo} from 'react';

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
  /** A label that should be displayed above all content */
  onDelete?: () => void;
  /** Restrict card height via a scrollable overflow option */
  scrollHeight?: string;
  /** Restrict card width */
  maxWidth?: string;
  /** Add pin button action */
  pinAction?: () => void;
  /** Add unpin button action */
  unpinAction?: () => void;
  /** Add unpin button action */
  isPinned?: boolean;
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

export default function CardGeneric(props: CardGenericPropsInput) {
  const {
    label,
    icon,
    name,
    status,
    id,
    content,
    onDelete,
    pinAction,
    unpinAction,
    actions,
    isPinned,
    scrollHeight,
    maxWidth,
  } = props;
  const titleStackList = useMemo(() => {
    const result: Array<ReactElement> = [];
    if (label !== undefined) {
      result.push(
        <Chip
          key="label"
          label={label}
          size="small"
          color="warning"
          icon={<InfoIcon />}
          onDelete={onDelete}
        />
      );
    }
    if (id !== undefined) {
      result.push(
        <Chip
          key="id"
          label={id}
          size="small"
          variant="outlined"
          icon={<FingerprintIcon />}
        />
      );
    }
    if (status !== undefined) {
      result.push(
        <Chip
          key="status"
          label={status}
          size="small"
          color="primary"
          icon={<InfoIcon />}
          sx={{maxWidth: '100%'}}
        />
      );
    }
    return result;
  }, [name, label, id, status, onDelete]);
  const iconActions = useMemo(() => {
    const result = [];
    if (
      pinAction !== undefined &&
      (isPinned === undefined || isPinned === false)
    ) {
      result.push(
        <IconButton aria-label="pin" onClick={() => pinAction()}>
          <PinIcon />
        </IconButton>
      );
    }
    if (
      unpinAction !== undefined &&
      (isPinned === undefined || isPinned === true)
    ) {
      result.push(
        <IconButton aria-label="unpin" onClick={() => unpinAction()}>
          <UnpinIcon />
        </IconButton>
      );
    }
    return result;
  }, [isPinned, pinAction, unpinAction]);
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
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      />
      <CardContent>
        {content.map((a, index) => (
          <div key={index}>
            {a.label ? (
              <Divider>
                <Chip
                  icon={a.labelIcon ?? undefined}
                  label={a.label}
                  size="small"
                />
              </Divider>
            ) : undefined}
            {a.content === null ? (
              <Box
                sx={{display: 'flex', width: '100%'}}
                justifyContent="center"
              >
                <CircularProgress />
              </Box>
            ) : (
              a.content
            )}
          </div>
        ))}
      </CardContent>
      {actions !== undefined && actions.length > 0 ? (
        <CardActions>{actions}</CardActions>
      ) : undefined}
    </Card>
  );
}
