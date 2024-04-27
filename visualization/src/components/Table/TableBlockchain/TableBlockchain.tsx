import * as React from 'react';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {useDemoData} from '@mui/x-data-grid-generator';
// Type imports
import type {
  DataGridProps,
  GridColDef,
  GridInitialState,
  GridRowModel,
} from '@mui/x-data-grid';

export interface GridDataGeneratorContext {
  /**
   * Values already attributed to this column.
   * Only defined if the column has the uniqueness mode activated.
   * The keys represent the random value and the value represents the amount of rows that already have this value.
   * This allows to data generators to add a suffix to the returned value to force the uniqueness.
   */
  values?: Record<string, number>;
}
export type GridColDefGenerator = GridColDef & {
  generateData?: (row: any, context: GridDataGeneratorContext) => any;
  /**
   * If `true`, each row will have a distinct value
   * If several rows are generated with the same value, then a suffix will be added to the 2nd, 3rd, ...
   * @default false
   */
  dataGeneratorUniquenessEnabled?: boolean;
  /**
   * If `true`, the column will be marked as hidden in the `columnVisibilityModel`.
   */
  hide?: boolean;
};

export interface GridDemoData extends DataGridProps {
  rows: GridRowModel[];
  columns: GridColDefGenerator[];
  initialState?: GridInitialState;
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function TableBlockchain() {
  const {data} = useDemoData({
    dataSet: 'Employee',
    rowLength: 10,
    visibleFields: VISIBLE_FIELDS,
  });
  console.log(data);

  return (
    <div style={{height: 500, width: '100%'}}>
      <DataGrid {...data} slots={{toolbar: GridToolbar}} />
    </div>
  );
}
