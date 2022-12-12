/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import * as React from "react";
import { css, useTheme } from "@emotion/react";
import type { MergeFirst } from "@resi-media/resi-ui";
import {
  Draft,
  getProp,
  Text,
  useForkRef,
  usePrevious,
} from "@resi-media/resi-ui";
import omit from "lodash/omit";
import type {
  PluginHooks,
  ResiTableOptions,
  Row,
  ResiColumn,
  ResiColumnProps,
  ResiHeaderGroupProps,
  TableInstance,
  TableState,
} from "react-table";
import { useFlexLayout, useGroupBy, useSortBy, useTable } from "react-table";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
// import { LinearGradient } from "@studio/components/LinearGradient";
// import { usePrefix } from "@studio/hooks";
import {
  ListTable,
  ListTableData,
  ListTableHeader,
  SubComponentWrapper,
  TableContainer,
} from "./styles";

// Disabling because @types/react-table does 'extends object'. Using their types for this interface.
type _Props<T extends object> = {
  SubComponent?: React.ElementType;
  columnHeaders?: ResiColumn<T>[];
  dataTestId?: string;
  hasData?: boolean;
  hasMore?: boolean;
  initialState?: Partial<TableState<T>>;
  isDisabled?: (rowData: T) => boolean | undefined;
  isHeaderFixed?: boolean;
  isLoading?: boolean;
  isPageFetching?: boolean;
  loadMoreData?: (
    startIndex: number,
    stopIndex: number
  ) => Promise<void> | void;
  maxHeight?: number;
  noDataNode?: React.ReactNode;
  noResultsNode?: React.ReactNode;
  onRowClick?: (rowData: T) => void;
  onRowExpand?: (...arg: T[]) => void;
  pluginHooks?: PluginHooks[];
  rowData?: T[];
  rowSpacing?: "l" | "m" | "s" | "xl" | "xs";
  tableOptions?: ResiTableOptions;
};

type _Ref<T extends object> = MergeFirst<HTMLDivElement, TableInstance<T>>;

const TableListInternal = <T extends object>(
  {
    columnHeaders,
    dataTestId = "table-list",
    hasData = false,
    hasMore = false,
    initialState,
    isDisabled,
    isHeaderFixed,
    isLoading,
    loadMoreData,
    maxHeight,
    noDataNode,
    noResultsNode,
    onRowClick,
    onRowExpand,
    pluginHooks = [],
    rowData,
    rowSpacing = "m",
    SubComponent,
    tableOptions,
  }: _Props<T>,
  ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element => {
  const resiTheme = useTheme();

  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<List | null>(null);
  const tbodyRef = React.useRef<HTMLDivElement | null>(null);
  const cellCountRef = React.useRef(0);
  const firstRow = React.useRef<Row<T>>();
  const rowHeights = React.useRef<{ [key: number]: number }>({});
  const [expandedRowHeight, setExpandedRowHeight] = React.useState<number>(0);
  const [expandedRow, setExpandedRow] = React.useState<string>("");
  const [canExpand, setCanExpand] = React.useState(true);
  const [tableHeight, setTableHeight] = React.useState(0);
  const columns = React.useMemo(() => columnHeaders ?? [], [columnHeaders]);
  const data = React.useMemo(() => rowData ?? [], [rowData]);
  const prevHasMore = usePrevious(hasMore);
  const tableEleRef = React.useRef<HTMLDivElement>({} as HTMLDivElement);
  const tableRef = React.useRef(
    useTable(
      { initialState, columns, data, ...tableOptions },
      useFlexLayout,
      ...pluginHooks
    )
  );
  const ownRef = useForkRef(ref, tableEleRef);

  React.useEffect(() => {
    // If list is fetched, reset expanded row state
    if (tableOptions?.autoResetExpanded && expandedRow !== "") {
      setExpandedRow("");
    }
  }, [expandedRow, isLoading, rowData, tableOptions?.autoResetExpanded]);

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    //@ts-ignore
    toggleRowExpanded,
  } = tableRef.current;

  React.useImperativeHandle(
    ref,
    () => {
      return {
        ...tableEleRef.current,
        ...tableRef.current,
      };
    },
    []
  );

  const setRowHeight = React.useCallback(
    (index: number, size: number, expandedSize = 0) => {
      listRef.current?.resetAfterIndex(0);
      rowHeights.current = { ...rowHeights.current, [index]: size };
      if (parseInt(expandedRow) === index) {
        setExpandedRowHeight(expandedSize);
      }

      setTableHeight(
        Object.values(rowHeights.current).reduce((agg: number, v) => {
          return (agg += v);
        }, expandedSize)
      );
    },
    [expandedRow]
  );

  const handleExpandRow = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rowToExpand: string[], args: Record<string, any>) => {
      if (!canExpand) {
        return;
      }
      setCanExpand(false);

      if (rowToExpand.includes(expandedRow)) {
        toggleRowExpanded(rowToExpand);
        setExpandedRow("");
        setCanExpand(true);
        return;
      }

      if (expandedRow) {
        toggleRowExpanded([expandedRow], false);
      }

      onRowExpand?.(args.row);
      toggleRowExpanded(rowToExpand, true);
      setExpandedRow(rowToExpand[0]);
      setCanExpand(true);
    },
    [canExpand, expandedRow, onRowExpand, toggleRowExpanded]
  );

  const findEnabledRow = (
    children: Element[],
    idx: number,
    direction: "backward" | "forward" = "forward"
  ): Element | null => {
    if (idx === 0 && direction === "backward") return null;
    if (idx === children.length - 1 && direction === "forward") return null;
    const indxToCheck =
      direction === "forward"
        ? Math.min(children.length - 1, idx + 1)
        : Math.max(0, idx - 1);
    if (children[indxToCheck].hasAttribute("data-disabled")) {
      return findEnabledRow(children, indxToCheck, direction);
    }
    return children[indxToCheck];
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    row: Row<T>
  ) => {
    event.stopPropagation();
    if (tbodyRef.current?.children) {
      const currentRow = tbodyRef.current.children.namedItem(row.id);
      const currentChildren = Array.from(tbodyRef.current.children);
      const indxOfCurrentRow = currentRow
        ? currentChildren.indexOf(currentRow)
        : 0;
      const nextRow = findEnabledRow(
        currentChildren,
        indxOfCurrentRow,
        "forward"
      );
      const prevRow = findEnabledRow(
        currentChildren,
        indxOfCurrentRow,
        "backward"
      );
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          (prevRow?.firstChild as HTMLElement | undefined)?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          (nextRow?.firstChild as HTMLElement | undefined)?.focus();
          break;
        case "Enter":
          handleRowClick(row);
          break;
        default:
          break;
      }
    }
  };

  const getPropsForColumn = React.useCallback(
    (column: ResiColumnProps<T>) => {
      let props = column.props ?? {};

      if (pluginHooks.includes(useSortBy) && column.getSortByToggleProps) {
        props = { ...props, ...column.getSortByToggleProps() };
      }

      if (pluginHooks.includes(useGroupBy) && column.getGroupByToggleProps) {
        props = { ...props, ...column.getGroupByToggleProps() };
      }

      return props;
    },
    [pluginHooks]
  );

  const getRowHeight = React.useCallback(
    (index: number) => {
      let supplementalRowHeight = 0;
      if (index === parseInt(expandedRow)) {
        supplementalRowHeight = expandedRowHeight;
      }
      return (rowHeights.current[index] || 82) + supplementalRowHeight;
    },
    [expandedRow, expandedRowHeight]
  );

  // Internal Row Component
  function Row({
    index: rowIdx,
    row: rowProp,
    style,
  }: {
    index: number;
    row?: Row<T>;
    style: React.CSSProperties;
  }) {
    const rowRef = React.useRef({} as HTMLDivElement | null);
    const expandedRowRef = React.useRef<HTMLDivElement>(null);
    const row = rowProp || (rows[rowIdx] as Row<T> | undefined);
    React.useEffect(() => {
      if (rowRef.current) {
        setRowHeight(
          rowIdx,
          rowRef.current.clientHeight,
          expandedRowRef.current?.clientHeight ?? 0
        );
      }
    }, [rowIdx, rowRef, expandedRowRef]);

    if (row) {
      prepareRow(row);

      if (row.cells.length > cellCountRef.current) {
        cellCountRef.current = row.cells.length;
      }
    }
    if (rowIdx === 0) {
      firstRow.current = row;
    }

    const isPriorRowExpanded = rowIdx > 0 && rows[rowIdx - 1]?.isExpanded;
    const isNextRowExpanded =
      rowIdx < rows.length - 1 && rows[rowIdx + 1]?.isExpanded;

    const baseRowProps =
      row?.getRowProps() || firstRow.current?.getRowProps() || {};
    const expandedRowProps =
      row?.getToggleRowExpandedProps?.() ||
      firstRow.current?.getToggleRowExpandedProps?.() ||
      {};
    const baseRowStyle = getProp(baseRowProps, "style");
    const expandedRowStyle = getProp(expandedRowProps, "style");
    const isRowDisabled = Boolean(row && isDisabled?.(row.original));

    return (
      <div
        key={`fragment${rowIdx}`}
        id={row?.id}
        style={style}
        {...(isRowDisabled && { "data-disabled": "" })}
      >
        <div
          data-testid="table-list-row"
          {...omit(baseRowProps, "style")}
          {...omit(expandedRowProps, "style")}
          key={`tr${rowIdx}`}
          className="tr"
          style={{
            display: "flex",
            flex: " 1 0 auto",
            minWidth: " 0px",
            backgroundColor: " rgb(255, 255, 255)",
            borderRight: " 1px solid rgb(232, 232, 232)",
            borderLeft: " 1px solid rgb(232, 232, 232)",
            cursor: " pointer",
            textAlign: "start",
          }}
          // css={css`
          //   ${baseRowStyle.found && css(baseRowStyle.found)}
          //   ${expandedRowStyle.found && css(expandedRowStyle.found)}
          //   background-color: ${resiTheme.palette.background.paper};
          //   border-right: 1px solid ${resiTheme.palette.divider};
          //   border-left: 1px solid ${resiTheme.palette.divider};
          //   ${rowIdx > 0 &&
          //   `border-top: 1px solid ${resiTheme.palette.divider};`}
          //   ${isPriorRowExpanded &&
          //   `border-top: 1px solid ${resiTheme.palette.divider};`}
          //   ${isNextRowExpanded &&
          //   !SubComponent &&
          //   `border-bottom: 1px solid ${resiTheme.palette.divider};`}
          //   ${getRowDisabledStyles(isRowDisabled)}
          //   &:focus {
          //     ${resiTheme.mixins.focusOutline(resiTheme)}
          //     position: relative;
          //   }
          // `}
          {...(row &&
            !isRowDisabled && {
              onClick: () => handleRowClick(row),
              onKeyDown: (e) => handleKeyDown(e, row),
              tabIndex: 0,
            })}
          ref={rowRef}
          role="row"
          title=""
        >
          {row &&
            row.cells.map((cell, cellIdx) => {
              return (
                <ListTableData
                  {...cell.getCellProps(cell.column.props)}
                  {...cell.getCellProps()}
                  key={`tr${rowIdx}-td${cellIdx}`}
                  className="td"
                  // style={{ display: "flex" }}
                  rowSpacing={rowSpacing}
                >
                  {cell.render("Cell", {
                    cellData: row.original,
                  })}
                </ListTableData>
              );
            })}
        </div>
        {SubComponent && (
          <div
            ref={expandedRowRef}
            // css={css`
            //   background-color: ${resiTheme.palette.background.paper};
            //   border-right: 1px solid ${resiTheme.palette.divider};
            //   border-left: 1px solid ${resiTheme.palette.divider};
            //   ${rowIdx < rows.length - 1 &&
            //   row?.isExpanded &&
            //   `border-bottom: 1px solid ${resiTheme.palette.divider};`}
            //   ${rowIdx === rows.length - 1 &&
            //   row?.isExpanded &&
            //   `border-bottom: 1px solid ${resiTheme.palette.divider};`}
            //         ${isNextRowExpanded &&
            //   `border-bottom: 1px solid ${resiTheme.palette.divider};`}
            // `}
            data-testid="table-list-expanded-row"
          >
            <div
              style={{
                verticalAlign: "middle",
                backgroundColor: resiTheme.palette.background.paper,
              }}
            >
              <SubComponentWrapper
                data-testid="table-list-subcomponent"
                isExpanded={Boolean(row?.isExpanded)}
              >
                {row?.isExpanded && <SubComponent {...row.original} />}
              </SubComponentWrapper>
            </div>
          </div>
        )}
      </div>
    );
  }

  React.useEffect(() => {
    if (prevHasMore && !hasMore) {
      setRowHeight(data.length, 0);
    }
  }, [prevHasMore, hasMore, data.length, setRowHeight]);

  const handleRowClick = React.useCallback(
    (row: Row<T>) => {
      if (onRowClick) {
        onRowClick(row.original);
        return;
      }
      if (row.getToggleRowExpandedProps) {
        handleExpandRow([row.id], { row: row.original });
      }
    },
    [handleExpandRow, onRowClick]
  );

  const getRowDisabledStyles = React.useCallback(
    (isDisabledProp?: boolean): string => {
      if (!isDisabledProp) {
        return `
      cursor: pointer;
      :hover {
        background-color: ${resiTheme.palette.primary.background};
      }
      `;
      }
      return `
      cursor: not-allowed;
    `;
    },
    [resiTheme.palette.primary.background]
  );

  const tableData = (
    <ListTable
      ref={ownRef}
      {...omit(getTableProps(), "ref")}
      {...(tableOptions?.props ?? {})}
      data-testid={dataTestId}
    >
      {/* Only render headers if we actually have headers. This will prevent blank row from rendering */}
      {columnHeaders?.some((header) => header.Header) && (
        <div
          ref={headerRef}
          // css={css`
          //   ${!isHeaderFixed &&
          //   `
          //     border-top: 1px solid ${resiTheme.palette.divider};
          //   `}
          //   border-right: 1px solid ${resiTheme.palette.divider};
          //   border-left: 1px solid ${resiTheme.palette.divider};
          // `}
        >
          {headerGroups.map(
            (headerGroup: ResiHeaderGroupProps<T>, rowIdx: number) => (
              <div {...headerGroup.getHeaderGroupProps()} key={`tr${rowIdx}`}>
                {headerGroup.headers.map(
                  (column: ResiHeaderGroupProps<T>, cellIdx: number) => (
                    <ListTableHeader
                      {...column.getHeaderProps(getPropsForColumn(column))}
                      key={`tr${rowIdx}-th${cellIdx}`}
                      className="th"
                      data-testid="table-list-header"
                      isSticky={isHeaderFixed}
                    >
                      <Text colorVariant="primary" isInline variant="label">
                        {column.render("Header")}
                      </Text>
                    </ListTableHeader>
                  )
                )}
              </div>
            )
          )}
        </div>
      )}
      <div
        {...getTableBodyProps()}
        ref={tbodyRef}
        style={{ height: "100%", width: "100%", flex: "1 0 0%" }}
      >
        <React.Fragment>
          {data.length === 0 ? (
            <div
              // css={css`
              //   background-color: ${resiTheme.palette.background.paper};
              //   border-right: 1px solid ${resiTheme.palette.divider};
              //   border-left: 1px solid ${resiTheme.palette.divider};
              //   border-top: 1px solid ${resiTheme.palette.divider};
              // `}
              data-testid="table-list-row"
            >
              <ListTableData rowSpacing={isLoading ? "xl" : "l"}>
                {isLoading ? (
                  <Draft.Progress
                    dataTestId="table-list-loading-icon"
                    sizeVariant="l"
                  />
                ) : (
                  noResultsNode ?? (
                    <h4 data-testid="table-list-default-noresults">
                      No Results
                    </h4>
                  )
                )}
              </ListTableData>
            </div>
          ) : maxHeight ? (
            <AutoSizer disableHeight>
              {({ width }) => {
                const itemCount = hasMore ? data.length + 1 : data.length;
                // Every row is loaded except for our loading indicator row.
                const isItemLoaded = (index: number) => {
                  return index < data.length;
                };
                const calcHeight = Math.min(
                  (maxHeight || 0) - (headerRef.current?.offsetHeight || 0) ||
                    0,
                  tableHeight
                );
                return (
                  <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    loadMoreItems={loadMoreData ?? (() => {})}
                  >
                    {({ onItemsRendered, ref: infiniteRef }) => {
                      return (
                        <List
                          ref={(list: List) => {
                            // Pass List ref through to InfiniteLoader
                            infiniteRef(list);

                            // And store a copy for yourself.
                            listRef.current = list;
                          }}
                          height={calcHeight || 0}
                          itemCount={itemCount}
                          itemSize={getRowHeight}
                          onItemsRendered={onItemsRendered}
                          width={width}
                        >
                          {Row}
                        </List>
                      );
                    }}
                  </InfiniteLoader>
                );
              }}
            </AutoSizer>
          ) : (
            rows.map((row: Row<T>, rowIdx: number) => {
              return (
                <Row
                  key={`row-${rowIdx}`}
                  index={rowIdx}
                  row={row}
                  style={{}}
                />
              );
            })
          )}
        </React.Fragment>
      </div>
    </ListTable>
  );

  if (!isLoading && data.length === 0 && !hasData) {
    return (
      <TableContainer data-testid={dataTestId}>
        {noDataNode ?? (
          <h4 data-testid="table-list-default-nodata">No Results</h4>
        )}
      </TableContainer>
    );
  }

  return tableData;
};

TableListInternal.displayName = "TableListInternal";

/* eslint-disable import/export */
export const TableList = React.forwardRef(TableListInternal) as <
  T extends object
>(
  props: _Props<T> & { ref?: React.ForwardedRef<_Ref<T>> }
) => ReturnType<typeof TableListInternal>;

/* eslint-disable @typescript-eslint/no-redeclare */
export namespace TableList {
  export type Props<T extends object> = _Props<T>;
  export type Ref<T extends object> = _Ref<T>;
}
