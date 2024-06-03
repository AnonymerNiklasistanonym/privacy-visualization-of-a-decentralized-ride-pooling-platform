'use client';

// Package imports
// > Components
import {Box, Chip, Typography} from '@mui/material';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';

export interface OverviewElementProps {
  showTitle?: boolean;
}

export interface ChipListProps {
  elements: ReadonlyArray<{
    description?: string;
    link: string;
    label: string;
    icon: ReactElement;
  }>;
}

export function ChipList({elements}: ChipListProps) {
  return (
    <ul>
      {elements.map(a => (
        <li style={{margin: '0.2rem'}} key={a.label}>
          <a href={a.link}>
            <Chip
              icon={a.icon}
              label={a.label}
              color="primary"
              onClick={() => {}}
            />
            <Box display={'inline'} sx={{fontStyle: 'italic'}}>
              {a.description ? ` ${a.description}` : undefined}
            </Box>
          </a>
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
    <Typography variant="h4" id={id} gutterBottom>
      {icon} {children}
    </Typography>
  ) : undefined;
}

export function OverviewElementSectionContent({children}: PropsWithChildren) {
  return (
    <Typography variant="body1" gutterBottom>
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
    <Typography variant="h5" id={id} gutterBottom>
      {icon} {children}
    </Typography>
  ) : undefined;
}
