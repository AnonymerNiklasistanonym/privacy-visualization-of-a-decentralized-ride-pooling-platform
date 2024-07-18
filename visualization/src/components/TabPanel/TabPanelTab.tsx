'use client';

// Package imports
import {memo, useCallback, useMemo, useState} from 'react';
// > Components
import {
  Badge,
  Box,
  ButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {Refresh as RefreshIcon} from '@mui/icons-material';
// > Components
import Footer from '@components/Footer';
import GenericButton from '@components/Input/InputButton/InputButtonGeneric';
// > Misc
import {debugComponentRenderCounter} from '@misc/debug';
import {stringComparator} from '@misc/compare';
// Type imports
import type {SettingsGlobalProps, SettingsUiProps} from '@misc/props/settings';
import type {PropsWithChildren} from 'react';
import {TabPanelTabSectionDebug} from './TabPanelTabSectionDebug';

interface TabPanelTabProps extends SettingsGlobalProps, SettingsUiProps {
  index: number;
  value: number;
}

export default memo(TabPanelTab);

export function TabPanelTab({
  children,
  value,
  index,
  stateSettingsUiGridSpacing,
  stateSettingsGlobalDebug,
}: PropsWithChildren<TabPanelTabProps>) {
  const spacing = useMemo<string>(
    () => `${stateSettingsUiGridSpacing / 2}rem`,
    [stateSettingsUiGridSpacing]
  );

  const [stateRenderList, setStateRenderList] = useState<
    Array<[string, number]>
  >([]);

  const updateRenderCount = useCallback(() => {
    setStateRenderList(
      Array.from(debugComponentRenderCounter).sort((a, b) =>
        stringComparator(a[0], b[0])
      )
    );
  }, [setStateRenderList]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            padding: {
              lg: `0 ${spacing} 0 ${spacing}`,
              md: 0,
              sm: 0,
              xl: `0 ${spacing} 0 ${spacing}`,
              xs: 0,
            },
          }}
        >
          {children}
          <Footer />
        </Box>
      )}
      <TabPanelTabSectionDebug
        title="Debug #Render"
        stateSettingsGlobalDebug={stateSettingsGlobalDebug}
      >
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <GenericButton onClick={updateRenderCount}>
            Update render count
          </GenericButton>
        </ButtonGroup>
        <List>
          {stateRenderList.map(([name, count]) => (
            <ListItem key={`simple-tabpanel-${index}-item-${name}`}>
              <ListItemIcon>
                <Badge badgeContent={count} max={100000} color="primary">
                  <RefreshIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </TabPanelTabSectionDebug>
    </div>
  );
}
