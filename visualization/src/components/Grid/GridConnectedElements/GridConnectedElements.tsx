// Package imports
import {memo, useCallback} from 'react';
// > Components
import {Badge, Box, Grid, Typography} from '@mui/material';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
// Local imports
// > Components
import {GridConnectedElementsCard} from './GridConnectedElementsCard';
// > Misc
import {debugComponentRender} from '@misc/debug';
// Type imports
import type {PropsWithChildren, ReactElement} from 'react';
import type {SettingsUiProps} from '@misc/props/settings';

/** A collapsible card section with a title and element count indicator */
export interface GridConnectedElementsSectionCards {
  title: string;
  icon: ReactElement;
  /** The connected elements (cards/components) */
  cards: Array<ReactElement>;
}

export interface GridConnectedElementsSectionInfoElement {
  title?: string;
  icon?: ReactElement;
  id: string;
  /** Content can either be a raw string or a custom element (component) */
  content: string | ReactElement;
  /** Card can be dismissed */
  dismissible?: boolean;
}

export interface GridConnectedElementsProps extends SettingsUiProps {
  /** Content related connected elements */
  stateConnectedElements: Array<GridConnectedElementsSectionCards>;
  /** Content related temporary elements that can be dismissed */
  stateInfoElements: Array<GridConnectedElementsSectionInfoElement>;
}

export default memo(GridConnectedElements);

export function GridConnectedElements({
  children,
  stateConnectedElements,
  stateInfoElements,
  stateSettingsUiGridSpacing,
}: PropsWithChildren<GridConnectedElementsProps>) {
  debugComponentRender('GridConnectedElements');

  const callbackOnDismiss = useCallback(() => {
    console.log('ACTION: DISMISS', stateInfoElements);
  }, [stateInfoElements]);

  const callbackOnExtend = useCallback((extend: boolean) => {
    console.log('ACTION: EXTEND', extend);
  }, []);

  return (
    <Box
      sx={{
        marginTop: `${stateSettingsUiGridSpacing / 2}rem`,
      }}
    >
      <Grid
        container
        spacing={stateSettingsUiGridSpacing}
        justifyContent="left"
        alignItems="stretch"
      >
        {/* Content */}
        <Grid item xs={12} md={6} xl={7}>
          {children}
        </Grid>
        {/* Temporary and Connected elements */}
        <Grid item xs={12} md={6} xl={5}>
          <Grid
            container
            spacing={stateSettingsUiGridSpacing}
            justifyContent="left"
            alignItems="stretch"
          >
            <Grid item xs={12} md={12} xl={12}>
              <Grid
                container
                spacing={stateSettingsUiGridSpacing}
                justifyContent="left"
                alignItems="stretch"
              >
                {stateInfoElements.map(
                  ({content, title, icon, id, dismissible}) => (
                    <GridConnectedElementsCard
                      key={`connected-elements-card-info-${id}`}
                      muiGridItemSize={12}
                      icon={icon}
                      title={title}
                      onDismiss={
                        dismissible === true ? callbackOnDismiss : undefined
                      }
                    >
                      {typeof content === 'string' ? (
                        <Typography variant="body2">{content}</Typography>
                      ) : (
                        content
                      )}
                    </GridConnectedElementsCard>
                  )
                )}
                {stateConnectedElements
                  .filter(a => a.cards.length > 0)
                  .map(stateConnectedElement => (
                    <GridConnectedElementsCard
                      key={`connected-elements-card-${stateConnectedElement.title}`}
                      icon={
                        <Badge
                          color="secondary"
                          badgeContent={stateConnectedElement.cards.length}
                          showZero
                        >
                          {stateConnectedElement.icon}
                        </Badge>
                      }
                      muiGridItemSize={12}
                      title={stateConnectedElement.title}
                      onExtend={callbackOnExtend}
                    >
                      <ResponsiveMasonry
                        columnsCountBreakPoints={{
                          0: 1,
                          600: 2,
                          900: 1,
                          1200: 2,
                        }}
                      >
                        <Masonry
                          gutter={`${stateSettingsUiGridSpacing / 2}rem`}
                        >
                          {stateConnectedElement.cards}
                        </Masonry>
                      </ResponsiveMasonry>
                    </GridConnectedElementsCard>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
