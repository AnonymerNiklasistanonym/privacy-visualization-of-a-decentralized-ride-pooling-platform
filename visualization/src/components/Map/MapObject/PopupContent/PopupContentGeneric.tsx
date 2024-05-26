// Package imports
import {useState} from 'react';
// > Components
import {Box, ListItem, Tooltip, Typography} from '@mui/material';
// Local imports
// > Components
import DataModal from '@components/Modal/DataModal';
// Type imports
import type {ChangeViewButtonProps} from '@components/Button/ChangeViewButton';
import type {DataModalInformation} from '@components/Modal/DataModal';
import type {ReactNode} from 'react';

export interface ShowContentSpectatorElement {
  spectator: string;
  description: string;
}

export interface DataElement {
  label: string;
  content: ReactNode;
  /** Show content only for the specified spectators. */
  showContentSpectator: ShowContentSpectatorElement[];
}

export interface RenderDataElementProps extends ChangeViewButtonProps {
  element: Readonly<DataElement>;
  id: string;
}

export function RenderDataElement(props: RenderDataElementProps) {
  const {element, stateSpectator, id} = props;

  const [stateOpen, setStateOpen] = useState(false);

  const dataModalContent: Array<DataModalInformation> = [
    {
      accessType: 'owner',
      description: 'Test ...',
      name: 'Test',
      spectator: props.id,
    },
  ];

  let content = element.content;
  let tooltip = '';
  if (
    stateSpectator !== id &&
    stateSpectator !== 'everything' &&
    !element.showContentSpectator.some(a => a.spectator === stateSpectator)
  ) {
    content = '******';
    tooltip = `This information is only available to this actor${
      element.showContentSpectator.length > 0
        ? ' and ' +
          element.showContentSpectator
            .map(a => `${a.spectator} (${a.description})`)
            .join(', ')
        : ''
    }`;
  }
  return (
    <ListItem
      key={element.label}
      style={{
        paddingTop: 4,
      }}
      disablePadding
    >
      <Typography
        variant="body2"
        gutterBottom
        style={{
          margin: 0,
          overflowWrap: 'break-word',
        }}
      >
        <Box fontWeight="medium" display="inline">
          {element.label}:{' '}
        </Box>
        <Tooltip title={tooltip} onClick={() => setStateOpen(true)} arrow>
          <Typography variant="body2" display="inline" noWrap gutterBottom>
            {content}
          </Typography>
        </Tooltip>
        <DataModal
          {...props}
          stateDataModalOpen={stateOpen}
          setStateDataModalOpen={setStateOpen}
          stateDataModalContent={dataModalContent}
        />
      </Typography>
    </ListItem>
  );
}
