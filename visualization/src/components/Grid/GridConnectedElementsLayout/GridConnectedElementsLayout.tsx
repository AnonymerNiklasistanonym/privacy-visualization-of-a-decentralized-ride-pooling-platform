// Package imports
// > Components
import {Badge, Card, CardContent, Grid, Typography} from '@mui/material';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
// Type imports
import {PropsWithChildren, ReactElement} from 'react';
import {GridConnectedElementsCard} from './GridConnectedElementsCard';

export interface ConnectedElementSection {
  /** Title of the connected element section */
  title: string;
  icon: ReactElement;
  /** The elements of the connected elements */
  elements: Array<ReactElement>;
}

export interface InfoElement {
  title: string;
  icon?: ReactElement;
  description: string;
}

export interface GridConnectedElementsLayoutProps {
  /** Content related connected elements */
  stateConnectedElements: Array<ConnectedElementSection>;
  /** Content related temporary elements that can be dismissed */
  stateInfoElements: Array<InfoElement>;
  /** The spacing between elements */
  stateSettingsUiGridSpacing: number;
}

export default function GridConnectedElementsLayout({
  children,
  stateConnectedElements,
  stateInfoElements,
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
          <Grid item xs={12} md={12} xl={12}>
            <Grid
              container
              spacing={stateSettingsUiGridSpacing}
              justifyContent="left"
              alignItems="stretch"
            >
              {stateInfoElements.map((element, index) => (
                <GridConnectedElementsCard
                  key={index + element.title}
                  muiGridItemSize={12}
                  icon={element.icon}
                  title={element.title}
                  onDismiss={() => {
                    console.log('ACTION: DISMISS', stateInfoElements);
                  }}
                >
                  <Typography variant="body2">{element.description}</Typography>
                </GridConnectedElementsCard>
              ))}
              {stateConnectedElements
                .filter(a => a.elements.length > 0)
                .map(stateConnectedElement => (
                  <GridConnectedElementsCard
                    key={stateConnectedElement.title}
                    icon={
                      <Badge
                        color="secondary"
                        badgeContent={stateConnectedElement.elements.length}
                        showZero
                      >
                        {stateConnectedElement.icon}
                      </Badge>
                    }
                    muiGridItemSize={12}
                    title={stateConnectedElement.title}
                    onExtend={extend => {
                      console.log('ACTION: EXTEND', extend);
                    }}
                  >
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        0: 1,
                        600: 2,
                        900: 1,
                        1200: 2,
                      }}
                    >
                      <Masonry gutter={`${stateSettingsUiGridSpacing / 2}rem`}>
                        {stateConnectedElement.elements.map(
                          (element, index) => (
                            <Card key={index} variant="outlined">
                              <CardContent>{element}</CardContent>
                            </Card>
                          )
                        )}
                      </Masonry>
                    </ResponsiveMasonry>
                  </GridConnectedElementsCard>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
