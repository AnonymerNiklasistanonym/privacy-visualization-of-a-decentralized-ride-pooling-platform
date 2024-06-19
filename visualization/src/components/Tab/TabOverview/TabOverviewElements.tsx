'use client';

// Package imports
// > Components
import {Box, Chip, Typography} from '@mui/material';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';
import type {ReactSetState} from '@misc/react';

export interface OverviewElementImageProps {
  setStateImgUrl: ReactSetState<string | undefined>;
  setStateImgModalOpen: ReactSetState<boolean>;
  setStateImgBg: ReactSetState<string | undefined>;
  setStateImgAlt: ReactSetState<string | undefined>;
}

export interface OverviewElementImagePropsInput
  extends OverviewElementImageProps {
  alt: string;
  url: string;
}

export function ImageBox({
  alt,
  setStateImgAlt,
  setStateImgBg,
  setStateImgUrl,
  setStateImgModalOpen,
  url,
}: OverviewElementImagePropsInput) {
  return (
    <Box
      component="img"
      sx={{
        backgroundColor: theme =>
          theme.palette.mode === 'light' ? undefined : '#fff',
        borderRadius: '1rem',
        maxHeight: 400,
        padding: '1rem',
        width: '100%',
      }}
      alt={alt}
      src={url}
      onClick={() => {
        setStateImgUrl(url);
        setStateImgAlt(alt);
        setStateImgBg('#fff');
        setStateImgModalOpen(true);
      }}
    />
  );
}

export interface OverviewElementProps {
  showTitle?: boolean;
}

export interface ChipListProps {
  elements: ReadonlyArray<ChipListElementProps>;
}

export interface ChipListElementProps {
  description?: string;
  link: string;
  label: string;
  icon: ReactElement;
  noDescription?: boolean;
}

export function ChipListElement({
  link,
  icon,
  label,
  description,
  noDescription,
}: ChipListElementProps) {
  return (
    <a href={link}>
      <Chip icon={icon} label={label} color="primary" onClick={() => {}} />
      {noDescription !== true ? (
        <Box display={'inline'} sx={{fontStyle: 'italic'}}>
          {description ? ` ${description}` : undefined}
        </Box>
      ) : undefined}
    </a>
  );
}

export function ChipList({elements}: ChipListProps) {
  return (
    <ul>
      {elements.map(a => (
        <li style={{margin: '0.2rem'}} key={a.label}>
          <ChipListElement {...a} />
        </li>
      ))}
    </ul>
  );
}
export interface OverviewElementTitleProps extends OverviewElementProps {
  icon?: ReactElement;
  id: string;
}

export function OverviewElementSectionTitle({
  children,
  icon,
  id,
  showTitle,
}: PropsWithChildren<OverviewElementTitleProps>) {
  return showTitle ? (
    <Typography variant="h5" id={id} gutterBottom>
      {icon} {children}
    </Typography>
  ) : undefined;
}

export function OverviewElementSectionContent({children}: PropsWithChildren) {
  return (
    <Typography variant="body1" component={'span'} gutterBottom>
      {children}
    </Typography>
  );
}

export function OverviewElementSectionHeadingTitle({
  children,
  icon,
  id,
  showTitle,
}: PropsWithChildren<OverviewElementTitleProps>) {
  return showTitle ? (
    <Typography variant="h6" id={id} gutterBottom>
      {icon} {children}
    </Typography>
  ) : undefined;
}
