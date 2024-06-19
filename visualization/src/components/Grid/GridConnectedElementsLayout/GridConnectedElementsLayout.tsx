// Package imports
// > Components
import {
  Badge,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';
import {Clear as DismissIcon} from '@mui/icons-material';
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
  description: string;
}

export interface GridConnectedElementsLayoutProps {
  /** Content related connected elements */
  stateConnectedElements: Array<ConnectedElementSection>;
  /** Content related temporary elements that can be dismissed */
  stateDismissibleElements: Array<DismissibleElement>;
}

export default function GridConnectedElementsLayout({
  children,
  stateConnectedElements,
  stateDismissibleElements,
}: PropsWithChildren<GridConnectedElementsLayoutProps>) {
  return (
    <Grid container spacing={1} justifyContent="left" alignItems="stretch">
      {/* Content */}
      <Grid item xs={12} md={6} xl={7}>
        {children}
      </Grid>
      {/* Temporary and Connected elements */}
      <Grid item xs={12} md={6} xl={5}>
        <Grid container spacing={1} justifyContent="left" alignItems="stretch">
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
                <Masonry gutter="1rem">
                  {stateDismissibleElements.map((element, index) => (
                    <Card key={index}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {element.title}
                        </Typography>
                        <Typography variant="body2">
                          {element.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton aria-label="dismiss">
                          <DismissIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </Grid>
          ) : undefined}
          {/* Connected elements */}
          <Grid item xs={12} md={12} xl={12}>
            <Paper
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                margin: {
                  md: '0.25rem',
                  xs: '0',
                },
                minHeight: {
                  md: 'calc(100vh - 10rem)',
                  xs: '100%',
                },
                overflow: {
                  md: 'scroll',
                  xs: 'auto',
                },
                padding: '1rem',
                width: '100%',
              }}
              elevation={2}
            >
              {stateConnectedElements.map(stateConnectedElement => (
                <>
                  <Grid key={stateConnectedElement.title} container spacing={2}>
                    <Grid item xs={12}>
                      <Badge
                        color="secondary"
                        badgeContent={stateConnectedElement.elements.length}
                        sx={{
                          marginBottom: '1rem',
                          marginTop: '0.5rem',
                        }}
                      >
                        <Stack direction="row" alignItems="center" gap={1}>
                          {stateConnectedElement.icon}
                          <Typography variant="h6" component="div">
                            {stateConnectedElement.title}
                          </Typography>
                        </Stack>
                      </Badge>

                      <ResponsiveMasonry
                        columnsCountBreakPoints={{
                          0: 1,
                          600: 2,
                          900: 1,
                          1200: 2,
                        }}
                      >
                        <Masonry gutter="1rem">
                          {stateConnectedElement.elements.map(
                            (element, index) => (
                              <Card key={index}>
                                <CardContent>{element}</CardContent>
                              </Card>
                            )
                          )}
                        </Masonry>
                      </ResponsiveMasonry>
                    </Grid>
                  </Grid>
                  <Divider
                    key={stateConnectedElement.title + '-divider'}
                    variant="fullWidth"
                    component="div"
                  />
                </>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
