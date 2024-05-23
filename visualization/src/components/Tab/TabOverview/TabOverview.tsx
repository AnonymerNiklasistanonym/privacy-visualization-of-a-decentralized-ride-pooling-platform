'use client';

// Package imports
// > Components
import {Divider, Typography} from '@mui/material';
// Local imports
// > Components
import {Blockchain, Participants, Services, Stakeholders} from './Elements';
import TabContainer from '@components/Tab/TabContainer';
import TabElementContainer from '@components/Tab/TabElementContainer';
// Type imports
import type {SettingsOverviewPropsStates} from '@misc/settings';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabOverviewProps extends SettingsOverviewPropsStates {}

// eslint-disable-next-line no-empty-pattern
export default function TabOverview({}: TabOverviewProps) {
  return (
    <TabContainer>
      <TabElementContainer
        elevation={2}
        style={
          {
            /*textAlign: 'center'*/
          }
        }
      >
        <Typography variant="h3" gutterBottom>
          GETACAR Platform
        </Typography>
        <Divider style={{marginBottom: '1rem'}} />
        <Stakeholders />
        <Participants />
        <Services />
        <Blockchain />
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" display="block" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          caption text
        </Typography>
        <Typography
          variant="overline"
          display="block"
          id="yourAnchorTag"
          gutterBottom
        >
          overline text
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
      </TabElementContainer>
    </TabContainer>
  );
}
