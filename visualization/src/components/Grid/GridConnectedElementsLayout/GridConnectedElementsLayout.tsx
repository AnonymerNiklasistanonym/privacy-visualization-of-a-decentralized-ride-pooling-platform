// Package imports
// > Components
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Clear as DismissIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
// Type imports
import {PropsWithChildren, ReactElement} from 'react';

export interface ConnectedElementSection {
  /** Title of the connected element section */
  title: string;
  icon: ReactElement;
  /** The elements of the connected elements */
  elements: Array<ReactElement>;
}

export interface DismissibleElement {
  title: string;
  icon?: ReactElement;
  description: string;
}

export interface GridConnectedElementsLayoutProps {
  /** Content related connected elements */
  stateConnectedElements: Array<ConnectedElementSection>;
  /** Content related temporary elements that can be dismissed */
  stateDismissibleElements: Array<DismissibleElement>;
  /** The spacing between elements */
  stateSettingsUiGridSpacing: number;
}

export default function GridConnectedElementsLayout({
  children,
  stateConnectedElements,
  stateDismissibleElements,
  stateSettingsUiGridSpacing,
}: PropsWithChildren<GridConnectedElementsLayoutProps>) {
  console.log('stateSettingsUiGridSpacing', stateSettingsUiGridSpacing);
  return (
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
          {/* Temporary elements */}
          {stateDismissibleElements.length > 0 ? (
            <Grid item xs={12} md={12} xl={12}>
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  0: 1,
                  600: 2,
                  900: 1,
                  1200: 2,
                }}
              >
                <Masonry gutter={`${stateSettingsUiGridSpacing / 2}rem`}>
                  {stateDismissibleElements.map((element, index) => (
                    <Card key={index}>
                      <CardHeader
                        avatar={element.icon ?? <InfoIcon />}
                        action={
                          <IconButton aria-label="dismiss">
                            <DismissIcon />
                          </IconButton>
                        }
                        title={element.title.toUpperCase()}
                      />
                      <CardContent>
                        <Typography variant="body2">
                          {element.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </Grid>
          ) : undefined}
          {/* Connected elements */}
          <Grid item xs={12} md={12} xl={12}>
            <Grid
              container
              spacing={stateSettingsUiGridSpacing}
              justifyContent="left"
              alignItems="stretch"
            >
              {stateConnectedElements
                .filter(a => a.elements.length > 0)
                .map(stateConnectedElement => (
                  <Grid item xs={12} key={stateConnectedElement.title}>
                    <Card>
                      <CardHeader
                        avatar={
                          <Badge
                            color="secondary"
                            badgeContent={stateConnectedElement.elements.length}
                            showZero
                          >
                            {stateConnectedElement.icon}
                          </Badge>
                        }
                        title={stateConnectedElement.title.toUpperCase()}
                        action={
                          <IconButton aria-label="expand">
                            <ExpandLessIcon />
                          </IconButton>
                        }
                      />
                      <CardContent>
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
                            {stateConnectedElement.elements.map(
                              (element, index) => (
                                <Card key={index} variant="outlined">
                                  <CardContent>{element}</CardContent>
                                </Card>
                              )
                            )}
                          </Masonry>
                        </ResponsiveMasonry>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
