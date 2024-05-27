// Package imports
// > Components
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
// Type imports
import type {ReactElement, ReactNode} from 'react';
import {ParticipantRideProviderIcon} from '@components/Icons';

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
}

export default function CardGeneric(props: CardGenericProps) {
  const {label, icon, name, status, id, content} = props;
  return (
    <Box display="flex" justifyContent="left">
      <Box
        component="section"
        sx={{
          maxWidth: '800px',
          width: '100%',
        }}
      >
        {label !== undefined ? (
          <Stack alignItems="center" direction="row" gap={2}>
            <Typography variant="h5" gutterBottom>
              {label}
            </Typography>
          </Stack>
        ) : undefined}
        <Stack alignItems="center" direction="row" gap={2}>
          {icon}
          <Typography variant="h5" gutterBottom>
            {name}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          style={{marginBottom: 10}}
        >
          <Chip
            label={id}
            size="small"
            variant="outlined"
            icon={<FingerprintIcon />}
          />
          {status !== undefined ? (
            <Chip
              label={status}
              size="small"
              color="primary"
              icon={<InfoIcon />}
            />
          ) : undefined}
        </Stack>
        {content.map(a => {
          return (
            <>
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
            </>
          );
        })}
      </Box>
    </Box>
  );
}
