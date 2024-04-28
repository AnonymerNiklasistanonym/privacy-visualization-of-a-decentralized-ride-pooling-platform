// Package imports
// > Components
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {Box} from '@mui/material';
// > Icons
import {
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Error as ErrorIcon,
  TravelExplore as TravelExploreIcon,
  WebStories as WebStoriesIcon,
} from '@mui/icons-material';
// Type imports
import type {
  GridColDef,
  GridEventListener,
  GridRowModel,
} from '@mui/x-data-grid';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProviderCompany,
  SimulationEndpointParticipantInformationRideProviderPerson,
  SimulationEndpointRideRequestInformation,
} from '@globals/types/simulation';
import type {DebugData} from '../DebugData';
import type {ReactState} from '@misc/react';

export type DebugDataType =
  | 'customer'
  | 'ride_provider'
  | 'ride_request'
  | 'smart_contract';

export interface TableDebugDataProps {
  stateDebugData: ReactState<DebugData>;
  debugDataType: DebugDataType;
}

const renderTypeIcon = (type: DebugDataType) =>
  type === 'customer' ? (
    <DirectionsWalkIcon />
  ) : type === 'ride_provider' ? (
    <DirectionsCarIcon />
  ) : type === 'ride_request' ? (
    <TravelExploreIcon />
  ) : type === 'smart_contract' ? (
    <WebStoriesIcon />
  ) : (
    <ErrorIcon />
  );

export default function TableDebugData({
  stateDebugData,
  debugDataType,
}: TableDebugDataProps) {
  const rows: GridRowModel[] = [];
  const columns: GridColDef[] = [
    {field: 'id', renderHeader: () => 'ID', width: 200},
    {field: 'type', renderCell: a => renderTypeIcon(a.value), width: 40},
  ];

  if (debugDataType === 'customer') {
    rows.push(
      ...stateDebugData.customers.map(
        a =>
          ({
            id: a.id,
            type: a.type,

            currentLocation: a.currentLocation,
            dateOfBirth: a.dateOfBirth,
            emailAddress: a.emailAddress,
            fullName: a.fullName,
            gender: a.gender,
            homeAddress: a.homeAddress,
            phoneNumber: a.phoneNumber,

            passenger: a.passenger,
            rideRequest: a.rideRequest,
          }) satisfies GridRowModel &
            Partial<SimulationEndpointParticipantInformationCustomer>
      )
    );
    columns.push(
      {field: 'currentLocation', renderCell: a => JSON.stringify(a.value)},
      {field: 'dateOfBirth'},
      {field: 'emailAddress'},
      {field: 'fullName'},
      {field: 'gender'},
      {field: 'homeAddress'},
      {field: 'phoneNumber'},
      {field: 'passenger'},
      {field: 'rideRequest'}
    );
  }
  if (debugDataType === 'ride_provider') {
    rows.push(
      ...stateDebugData.rideProviders.map(
        a =>
          ({
            id: a.id,
            type: a.type,

            currentLocation: a.currentLocation,
            dateOfBirth: 'dateOfBirth' in a ? a.dateOfBirth : undefined,
            emailAddress: 'emailAddress' in a ? a.emailAddress : undefined,
            fullName: 'fullName' in a ? a.fullName : undefined,
            gender: 'gender' in a ? a.gender : undefined,
            homeAddress: 'homeAddress' in a ? a.homeAddress : undefined,
            phoneNumber: 'phoneNumber' in a ? a.phoneNumber : undefined,

            company: 'company' in a ? a.company : undefined,

            passengerList: a.passengerList,
            rideRequest: a.rideRequest,
          }) satisfies GridRowModel &
            Partial<SimulationEndpointParticipantInformationRideProviderCompany> &
            Partial<SimulationEndpointParticipantInformationRideProviderPerson>
      )
    );
    columns.push(
      {field: 'currentLocation', renderCell: a => JSON.stringify(a.value)},
      {field: 'dateOfBirth'},
      {field: 'emailAddress'},
      {field: 'fullName'},
      {field: 'gender'},
      {field: 'homeAddress'},
      {field: 'phoneNumber'},
      {field: 'company'},
      {
        field: 'passengerList',
        renderCell: a => (a.value !== undefined ? a.value.join(', ') : ''),
      },
      {field: 'rideRequest'}
    );
  }
  if (debugDataType === 'ride_request') {
    rows.push(
      ...stateDebugData.rideRequests.map(
        a =>
          ({
            id: a.id,
            type: a.type,

            dropoffLocation: a.dropoffLocation,
            dropoffLocationCoordinates: a.dropoffLocationCoordinates,
            maxPassengers: a.maxPassengers,
            maxWaitingTime: a.maxWaitingTime,
            minPassengerRating: a.minPassengerRating,
            minRating: a.minRating,
            pickupLocation: a.pickupLocation,
            pickupLocationCoordinates: a.pickupLocationCoordinates,
            rating: a.rating,
            userId: a.userId,
            userPublicKey: a.userPublicKey,
          }) satisfies GridRowModel &
            Partial<SimulationEndpointRideRequestInformation>
      )
    );
    columns.push(
      {field: 'dropoffLocation'},
      {
        field: 'dropoffLocationCoordinates',
        renderCell: a => JSON.stringify(a.value),
      },
      {field: 'maxPassengers'},
      {field: 'maxWaitingTime'},
      {field: 'minPassengerRating'},
      {field: 'minRating'},
      {field: 'pickupLocation'},
      {
        field: 'pickupLocationCoordinates',
        renderCell: a => JSON.stringify(a.value),
      },
      {field: 'rating'},
      {field: 'userId'},
      {field: 'userPublicKey'}
    );
  }
  if (debugDataType === 'smart_contract') {
    // TODO
  }

  const handleEventRowClick: GridEventListener<'rowClick'> = params => {
    console.log('rowClick', debugDataType, params.row, params);
  };

  const handleEventCellClick: GridEventListener<'cellClick'> = params => {
    console.log('cellClick', debugDataType, params.row, params);
  };

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          density: 'compact',
          sorting: {
            sortModel: [
              {
                field: 'id',
                sort: 'asc',
              },
              {
                field: 'type',
                sort: 'asc',
              },
            ],
          },
        }}
        slots={{toolbar: GridToolbar}}
        onRowClick={handleEventRowClick}
        onCellClick={handleEventCellClick}
      />
    </Box>
  );
}
