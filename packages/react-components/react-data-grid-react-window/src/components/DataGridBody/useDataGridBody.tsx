import * as React from 'react';
import type { DataGridBodyProps, DataGridBodyState } from './DataGridBody.types';
import {
  useDataGridBody_unstable as useDataGridBodyBase_unstable,
  RowRenderFunction,
  TableRowData,
  TableRowIdContextProvider,
} from '@fluentui/react-table';
import { TableRowIndexContextProvider } from '../../contexts/rowIndexContext';

/**
 * Create the state required to render DataGridBody.
 *
 * The returned state can be modified with hooks such as useDataGridBodyStyles_unstable,
 * before being passed to renderDataGridBody_unstable.
 *
 * @param props - props from this instance of DataGridBody
 * @param ref - reference to root HTMLElement of DataGridBody
 */
export const useDataGridBody_unstable = (props: DataGridBodyProps, ref: React.Ref<HTMLElement>): DataGridBodyState => {
  const { height, itemSize, width = '100%', ariaRowIndexStart = 2, children } = props;

  // cast the row render function to work with unknown args
  const renderRowWithUnknown = children as RowRenderFunction;
  const baseState = useDataGridBodyBase_unstable({ ...props, children: renderRowWithUnknown }, ref);

  const virtualizedRow: DataGridBodyState['virtualizedRow'] = React.useCallback(
    ({ data, index, style }) => {
      const row: TableRowData<unknown> = data[index];
      return (
        <TableRowIndexContextProvider value={ariaRowIndexStart + index}>
          <TableRowIdContextProvider value={row.rowId}>{children(row, style)}</TableRowIdContextProvider>
        </TableRowIndexContextProvider>
      );
    },
    [ariaRowIndexStart, children],
  );

  return {
    ...baseState,
    itemSize,
    height,
    virtualizedRow,
    width,
    ariaRowIndexStart,
  };
};
