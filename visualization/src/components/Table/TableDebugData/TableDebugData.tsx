// Package imports
import {useEffect, useMemo} from 'react';
import {useIntl} from 'react-intl';
// > Components
import {Box, Rating} from '@mui/material';
import {DataGrid, GridLogicOperator, GridToolbar} from '@mui/x-data-grid';
// > Icons
import {Error as ErrorIcon} from '@mui/icons-material';
// Local imports
// > Components
import {
  MiscRideContractSmartContractIcon,
  ParticipantCustomerIcon,
  ParticipantRideProviderIcon,
  ParticipantRideRequestIcon,
} from '@components/Icons';
// Type imports
import type {
  GridColDef,
  GridEventListener,
  GridFilterModel,
  GridRowModel,
} from '@mui/x-data-grid';
import type {
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationRideProviderCompany,
  SimulationEndpointParticipantInformationRideProviderPerson,
  SimulationEndpointRideRequestInformation,
  SimulationEndpointSmartContractInformation,
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
  onRowClick?: (type: DebugDataType, id: string) => void;
  height?: string;
  filterData?: Array<[field: string, values: Array<string>]>;
}

const renderTypeIcon = (type: DebugDataType) =>
  type === 'customer' ? (
    <ParticipantCustomerIcon />
  ) : type === 'ride_provider' ? (
    <ParticipantRideProviderIcon />
  ) : type === 'ride_request' ? (
    <ParticipantRideRequestIcon />
  ) : type === 'smart_contract' ? (
    <MiscRideContractSmartContractIcon />
  ) : (
    <ErrorIcon />
  );

const ID_LENGTH = 150;

export default function TableDebugData({
  stateDebugData,
  debugDataType,
  height,
  filterData,
  onRowClick,
}: TableDebugDataProps) {
  const intl = useIntl();

  const rows: GridRowModel[] = [];
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: intl.formatMessage({id: 'data.id'}),
      width: ID_LENGTH,
    },
    {
      field: 'type',
      headerName: intl.formatMessage({id: 'data.type'}),
      renderCell: a => renderTypeIcon(a.value),
      width: 40,
    },
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
            vehicleIdentificationNumber:
              'vehicleIdentificationNumber' in a
                ? a.vehicleIdentificationNumber
                : undefined,
            vehicleNumberPlate:
              'vehicleNumberPlate' in a ? a.vehicleNumberPlate : undefined,

            passengerList: a.passengerList,
            rideRequest: a.rideRequest,
          }) satisfies GridRowModel &
            Partial<SimulationEndpointParticipantInformationRideProviderCompany> &
            Partial<SimulationEndpointParticipantInformationRideProviderPerson>
      )
    );
    columns.push(
      {field: 'currentLocation', renderCell: a => JSON.stringify(a.value)},
      {field: 'vehicleIdentificationNumber'},
      {field: 'vehicleNumberPlate'},
      {field: 'company'},
      {field: 'dateOfBirth'},
      {field: 'emailAddress'},
      {field: 'fullName'},
      {field: 'gender'},
      {field: 'homeAddress'},
      {field: 'phoneNumber'},
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
    rows.push(
      ...stateDebugData.smartContracts.map(
        a =>
          ({
            id: a.walletId,
            type: a.type,

            customerId: a.customerId,
            customerRating: a.customerRating,
            rideProviderId: a.rideProviderId,
            rideProviderRating: a.rideProviderRating,
          }) satisfies GridRowModel &
            Partial<SimulationEndpointSmartContractInformation>
      )
    );
    columns.push(
      {
        field: 'customerId',
        headerName:
          intl.formatMessage({id: 'getacar.participant.customer'}) +
          ' ' +
          intl.formatMessage({id: 'data.id'}),
        width: ID_LENGTH,
      },
      {
        field: 'rideProviderId',
        headerName:
          intl.formatMessage({id: 'getacar.participant.rideProvider'}) +
          ' ' +
          intl.formatMessage({id: 'data.id'}),
        width: ID_LENGTH,
      },
      {
        field: 'customerRating',
        headerName:
          intl.formatMessage({id: 'getacar.participant.customer'}) +
          ' ' +
          intl.formatMessage({id: 'data.rating'}),
        renderCell: a => (
          <Box sx={{alignItems: 'center', display: 'flex', pr: 2}}>
            <Rating
              name="rating"
              precision={0.5}
              disabled={a.value === undefined}
              value={a.value ?? 0}
            />
          </Box>
        ),
        width: 150,
      },
      {
        field: 'rideProviderRating',
        headerName:
          intl.formatMessage({id: 'getacar.participant.rideProvider'}) +
          ' ' +
          intl.formatMessage({id: 'data.rating'}),
        renderCell: a => (
          <Box sx={{alignItems: 'center', display: 'flex', pr: 2}}>
            <Rating
              name="rating"
              precision={0.5}
              disabled={a.value === undefined}
              value={a.value ?? 0}
            />
          </Box>
        ),
        width: 150,
      }
    );
  }

  const handleEventRowClick: GridEventListener<'rowClick'> = params => {
    console.log('rowClick', debugDataType, params.row, params);
    if (onRowClick !== undefined) {
      onRowClick(debugDataType, params.row.id ?? -1);
    }
  };

  const handleEventCellClick: GridEventListener<'cellClick'> = params => {
    console.log('cellClick', debugDataType, params.row, params);
  };

  const filterModel = useMemo<GridFilterModel | undefined>(() => {
    if (filterData === undefined) {
      return undefined;
    }
    return {
      items: filterData.flatMap(([field, values], index) =>
        values.map((value, index2) => ({
          field,
          id: index * 10000 + index2,
          operator: 'is',
          value,
        }))
      ),
      logicOperator: GridLogicOperator.Or,
    };
  }, [filterData]);

  useEffect(() => {
    console.warn('Updated filterModel', filterModel);
  }, [filterModel]);

  return (
    <Box
      sx={{
        height: height ?? '20rem',
        width: '100%',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          density: 'compact',
          pagination: {
            rowCount: 25,
          },
          sorting: {
            sortModel: [
              {
                field: 'id',
                sort: 'asc',
              },
            ],
          },
        }}
        slots={{toolbar: GridToolbar}}
        onRowClick={handleEventRowClick}
        onCellClick={handleEventCellClick}
        filterModel={filterModel}
      />
    </Box>
  );
}
