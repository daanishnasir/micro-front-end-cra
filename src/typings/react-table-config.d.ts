/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { Theme } from "@emotion/react";
import type { Interpolation } from "@emotion/serialize";
import type {
  Column,
  useExpanded,
  useSortBy,
  useGroupBy,
  HeaderGroup,
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedInstanceProps,
  UseExpandedHooks,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  UseTableInstanceProps,
  UseTableRowProps,
} from "react-table";

declare module "react-table" {
  export interface ResiTableOptions<D extends Record<string, unknown> = {}>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D>,
      Omit<ResiTableOptions<D>, "columns" | "pageCount">,
      UseTableInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {
    props?: Omit<React.HTMLProps<HTMLTableDataCellElement>, "key"> & {
      css?: Interpolation<Theme>;
    };
  }

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export interface Row<D extends object = {}>
    extends UseTableRowProps<D>,
      Omit<Partial<UseExpandedRowProps<D>>, "subRows"> {}

  export type ResiCellProps<D extends object, V = any> = TableInstance<D> & {
    cell: Cell<D, V>;
    column: ColumnInstance<D>;
    row: ResiRow<D>;
    value: CellValue<V>;
  };

  export interface CustomCellProps<T extends Record<T, unknown>>
    extends ResiCellProps<T> {
    cellData: T;
  }

  export type PluginHooks =
    | typeof useExpanded
    | typeof useGroupBy
    | typeof useSortBy;
  export type CustomProps = {
    props?: Omit<React.HTMLProps<HTMLTableDataCellElement>, "key"> & {
      css?: Interpolation<Theme>;
    };
  };

  export type ResiColumn<T> = Column<T> & CustomProps;
  export type ResiColumnProps<D> = Partial<UseGroupByColumnProps<D>> &
    Partial<UseSortByColumnProps<D>> &
    ResiColumn<D>;
  export type ResiHeaderGroupProps<D> = HeaderGroup<D> &
    Partial<UseGroupByColumnProps<D>> &
    Partial<UseSortByColumnProps<D>>;
}
